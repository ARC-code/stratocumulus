const graphology = require('graphology')
const graphologyLayout = require('graphology-layout')
const graphologyForce = require('graphology-layout-force')
const graphologyNoverlap = require('graphology-layout-noverlap')
const config = require('./config')
const normalize_size = require('./normalize_size')

const default_color = config.default_color
const kind_color_map = config.kind_color_map
const min_node_size = config.sizing.min_node_size

let strata = {};
let strata_trail = [];
let global_context = {};
let current_stratum = 0;

let sky = null;
let minimap = null;
let zoomer = null;
let zoom_timer = null;

let graph_timers = {};

document.addEventListener('DOMContentLoaded', function () {
    sky = document.querySelector('#sky');
    minimap = document.querySelector('#minimap');

    let graph_stream = new EventSource(stratocumulus.sseStreamUrl);
    graph_stream.addEventListener(stratocumulus.sseStreamKey, function(event) {
        let subgraph = JSON.parse(event.data);
        if (subgraph.hasOwnProperty('path') && strata.hasOwnProperty(subgraph.path)) {
            if (subgraph.hasOwnProperty('nodes')) {
                subgraph.nodes.map(n => {
                    let attrs = {'label': n.label, x: 1, y: 1};

                    if (n.hasOwnProperty('kind') && n.kind in kind_color_map) {
                        attrs['color'] = kind_color_map[n.kind];
                    } else {
                        attrs['color'] = default_color;
                    }

                    if (n.hasOwnProperty('value')) attrs['size'] = normalize_size(n.value);
                    if (n.hasOwnProperty('fixed')) attrs['fixed'] = n.fixed;
                    if (n.hasOwnProperty('parent')) attrs['parent'] = n.parent;

                    strata[subgraph.path].graph.addNode(n.id, attrs);
                });
            }
            if (subgraph.hasOwnProperty('edges')) {
                subgraph.edges.map(e => strata[subgraph.path].graph.addEdge(e.from, e.to));
            }

            perform_layout(subgraph.path);

            if (graph_timers.hasOwnProperty(subgraph.path))
                clearTimeout(graph_timers[subgraph.path]);

            graph_timers[subgraph.path] = setTimeout(fit_network.bind(this, subgraph.path), 3000);
        }
    });

    build_stratum('/', {}, 'ARC', "#444444");
}, false);

function build_stratum(path, context, label, bg_color) {
    if (!strata.hasOwnProperty(path)) {
        let div_id = path.replaceAll('/', 'X');
        let network_div = document.createElement('div');
        network_div.id = div_id;
        //sky.style.backgroundColor = bg_color;
        network_div.className = "network";
        sky.appendChild(network_div);
        network_div.scrollIntoView();

        strata[path] = {
            div: document.getElementById(div_id),
            graph: new graphology.Graph(),
            layout: null,
            label: label,
            image_src: null,
            bg_color: bg_color,
            context: Object.assign({}, context)
        };

        `strata[path].network = new vis.Network(strata[path].div, strata[path].data, graph_options);
        strata[path].network.on("click", function(params) {
            if (params.nodes.length > 0) {
                let clicked_uri = params.nodes[0];
                let node = strata[path].data.nodes.get(clicked_uri);
                if (node.hasOwnProperty('kind')) {
                    console.log(clicked_uri);
                    let obj_id_regex = new RegExp("([^/]*)$", "gm");
                    let obj_id_match = obj_id_regex.exec(clicked_uri);
                    let obj_id = obj_id_match[1];
                    let new_context = Object.assign({}, strata[path].context);
                    new_context[f_{node.kind}.id] = obj_id;
                    build_stratum(clicked_uri, new_context, node.label, node.color);
                }
            }
        });`

        const http = new XMLHttpRequest()
        let request_url = `/build_stratum?path=${path}`;
        Object.keys(context).map(key => {
           request_url += `&${key}=${context[key]}`;
        });
        http.open("GET", request_url)
        http.send();

        strata_trail.push(path);
        current_stratum = strata_trail.length - 1;
    }
}

function perform_layout(path, final=false) {

    if (!final) {
        graphologyLayout.circlepack.assign(strata[path].graph, {
            hierarchyAttributes: ['parent'],
            center: 0,
            scale: 1.1
        });
    }

    if (final) {
        let rotations = {};
        let rotation_degree = 0;
        let zero_outliers_found = false;

        while (rotation_degree <= 340) {
            let node_coords = strata[path].graph.mapNodes((node_id, node_attrs) => {
                return [node_attrs.x + (window.innerWidth / 2), node_attrs.y + (window.innerHeight / 2)]
            });
            let outliers = 0;
            for (const coord of node_coords) {
                if (coord[0] < 0 || coord[0] > window.innerWidth || coord[1] < 0 || coord[1] > window.innerHeight)
                    outliers += 1;
            }
            rotations[outliers] = rotation_degree;

            if (rotation_degree > 0 || rotation_degree < 340)
                graphologyLayout.rotation.assign(strata[path].graph, rotation_degree, {degrees: true, centeredOnZero: true});

            if (outliers === 0) {
                zero_outliers_found = true;
                break;
            } else
                rotation_degree += 20;
        }

        if (!zero_outliers_found) {
            let fewest_outliers = Math.min(...Object.keys(rotations));
            let best_rotation = rotations[fewest_outliers];
            let degrees_to_rotate = best_rotation + (360 - rotation_degree);

            graphologyLayout.rotation.assign(strata[path].graph, degrees_to_rotate, {degrees: true});
        }
    }

    draw_graph(path, final);
}

function draw_graph(path, final=false) {
    let div_id = path.replaceAll('/', 'X');
    let div = $(`#${div_id}`);

    strata[path].graph.forEachNode(function(key, attrs) {
        let n_id = key.replaceAll('/', '_');
        let n_latch = $(`#${n_id}-latch`);
        let n_label = $(`#${n_id}-label`);
        let n = $(`#${n_id}`);
        let size = min_node_size;
        if (attrs.hasOwnProperty('size')) size = attrs.size;
        let n_x = attrs.x + ( (window.innerWidth / 2) - (size / 2) );
        let n_y = attrs.y + ( (window.innerHeight / 2) - (size / 2) );
        let latch_style_specs = `top: ${attrs.y + (window.innerHeight / 2)}px; left: ${attrs.x + (window.innerWidth / 2)}px;`;
        let label_style_specs = latch_style_specs + ` font-size: ${size / 3}px; margin-top: -${(size / 3) / 2}px`;
        let node_style_specs = `top: ${n_y}px; left: ${n_x}px; height: ${size}px; width: ${size}px; ${node_color_css(attrs.color)}`;
        let data_attrs = "";
        for (let a in attrs) {
            data_attrs += ` data-${a}="${attrs[a]}"`
        }
        if (!n.length) {
            div.append(`
                        <div id="${n_id}-latch" class="latch" style="${latch_style_specs}"></div>
                        <div id="${n_id}" class="node" style="${node_style_specs}"${data_attrs}></div>
                        <span id="${n_id}-label" class="label" style="${label_style_specs}">${attrs.label}</span>
                    `);
        } else {
            n_latch.attr('style', latch_style_specs);
            n_label.attr('style', label_style_specs);
            n.attr('style', node_style_specs);
        }
    });


    if (final) {
        strata[path].graph.forEachEdge(function (edge_key, edge_attrs, source_key, target_key) {
            let source_id = source_key.replaceAll('/', '_');
            let target_id = target_key.replaceAll('/', '_');
            $(`#${source_id}-latch, #${target_id}-latch`).connections({within: '#sky', class: 'edge'});
        });

        zoomer = panzoom(sky);
        zoomer.on('transform', function(e) {
            clearTimeout(zoom_timer);
            zoom_timer = setTimeout(semantic_zoom, 1000);
        });
    }
}

function fit_network(path) {
    if (strata.hasOwnProperty(path)) {
        setTimeout(take_network_snapshot.bind(this, path), 1000);
    }
}

function take_network_snapshot(path) {
    if (strata.hasOwnProperty(path)) {
        if (strata.hasOwnProperty(path)) {
            perform_layout(path, true);
        }

        `
        let minimap_image_id = strata[path].div.id + "_minimap_img";
        let minimap_image_div_id = minimap_image_id + "_div";

        if (!minimap.querySelector(minimap_image_div_id)) {
            strata[path].image_src = strata[path].div.querySelector('canvas').toDataURL();

            let minimap_image_div = document.createElement('div');
            minimap_image_div.id = minimap_image_div_id;
            minimap_image_div.style.backgroundColor = strata[path].bg_color;
            minimap.appendChild(minimap_image_div);
            minimap_image_div = minimap.querySelector(#{minimap_image_div_id});

            let minimap_image = new Image();
            minimap_image.id = minimap_image_id;
            minimap_image.src = strata[path].image_src;
            minimap_image.className = "minimap-img";
            minimap_image_div.appendChild(minimap_image);
        }
        `
    }
}

function node_color_css(colors) {
    return `background: -webkit-gradient(linear, left top, left bottom, from(${colors[0]}), to(${colors[1]})); background: -webkit-linear-gradient(top, ${colors[0]}, ${colors[1]}); background: -moz-linear-gradient(top, ${colors[0]}, ${colors[1]}); background: -ms-linear-gradient(top, ${colors[0]}, ${colors[1]}); background: -o-linear-gradient(top, ${colors[0]}, ${colors[1]});`;
}

function semantic_zoom() {
    $('.node').each(function() {
        let node = $(this);
        let label = $(`#${node[0].id}-label`);
        let rect = node[0].getBoundingClientRect();
        if (rect.width >= 20) {
            label.show();
        } else
            label.hide();
    });
}

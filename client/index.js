const graphology = require('graphology')
const graphologyLayout = require('graphology-layout')
const graphologyForce = require('graphology-layout-force')
const graphologyNoverlap = require('graphology-layout-noverlap')

let strata = {};
let strata_trail = [];
let current_stratum = 0;

let body = null;
let minimap = null;

let sizing = {
    max_node_size: 100,
    min_node_size: 10,
    max_value: 100,
    min_value: 10
};

let default_color = "#0868ac";
let kind_color_map = {
    genres: "#006d2c",
    disciplines: "#e2aa00",
    federations: "#810f7c"
};
let graph_timers = {};

document.addEventListener('DOMContentLoaded', function () {
    body = document.querySelector('body');
    minimap = document.querySelector('#minimap');

    let graph_stream = new EventSource("{{ url_for('sse.stream') }}");
    graph_stream.addEventListener('{{ key }}', function(event) {
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
        network_div.style.backgroundColor = bg_color;
        network_div.className = "network";
        body.appendChild(network_div);
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
        strata[path].layout = graphologyLayout.circlepack(strata[path].graph, {
            hierarchyAttributes: ['parent']
        });

        assign_positions(path);
    }

    if (final) {
        /*
        strata[path].graph.forEachNode(function(key, attrs) {
            if(['Federations', 'Genres', 'Disciplines'].includes(attrs.label))
                strata[path].graph.mergeNodeAttributes(key, {'fixed': true});
        });

         */

        strata[path].layout = graphologyForce(strata[path].graph, {
            maxIterations: 10000,
            settings: {
                attraction: 0.01,
                maxMove: 100
            }
        });

        assign_positions(path);


        strata[path].layout = graphologyNoverlap(strata[path].graph, {
            maxIterations: 200,
            settings: {
                margin: 20,
                //adjustSizes: true,
                //gravity: 5,
                //strongGravityMode: true
            },
        });

        assign_positions(path);
    }

    draw_graph(path, final);
}

function assign_positions(path) {
    for (let node_key in strata[path].layout) {
        strata[path].graph.mergeNodeAttributes(
            node_key,
            strata[path].layout[node_key]
        );
    }
}

function draw_graph(path, final=false) {
    let div_id = path.replaceAll('/', 'X');
    let div = $(`#${div_id}`);

    strata[path].graph.forEachNode(function(key, attrs) {
        let n_id = key.replaceAll('/', '_');
        let n = $(`#${n_id}`);
        let size = sizing.min_node_size;
        if (attrs.hasOwnProperty('size')) size = attrs.size;
        let n_x = attrs.x + (window.innerWidth / 2);
        let n_y = attrs.y + (window.innerHeight / 2);
        let style_specs = `top: ${n_x}px; left: ${n_y}px; height: ${size}px; width: ${size}px; background-color: ${attrs.color};`;
        let data_attrs = "";
        for (let a in attrs) {
            data_attrs += `${a}=${attrs[a]};`
        }
        if (!n.length) {
            div.append(`
                        <div id="${n_id}" class="node" style="${style_specs}" data-attrs="${data_attrs}"></div>
                    `);
        } else {
            n.attr('style', style_specs);
        }
    });


    if (final) {
        strata[path].graph.forEachEdge(function (edge_key, edge_attrs, source_key, target_key) {
            let source_id = source_key.replaceAll('/', '_');
            let target_id = target_key.replaceAll('/', '_');
            $(`#${source_id}, #${target_id}`).connections();
        });
    }
}

function fit_network(path) {
    if (strata.hasOwnProperty(path)) {
        //strata[path].network.fit({animate: true});
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

function normalize_size(s) {
    if (s < sizing.min_value) { sizing.min_value = s; }
    if (s > sizing.max_value) { sizing.max_value = s; }

    let mx = (s - sizing.min_value) / (sizing.max_value - sizing.min_value);
    let preshiftNorm = mx * (sizing.max_node_size - sizing.min_node_size);
    return parseInt(preshiftNorm + sizing.min_node_size);
}

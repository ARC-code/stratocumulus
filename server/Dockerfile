FROM python:3.8-slim-buster
WORKDIR /usr/src/app
# Copy and install the requirements first to speed up image rebuild.
COPY ./requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt
# Then copy runnable server files
COPY ./*.py ./
COPY ./adapters ./adapters
COPY ./templates ./templates
# Start up the Flask server
CMD ["gunicorn", "stratocumulus:app", "--worker-class", "gevent", "--bind", "0.0.0.0:8000"]

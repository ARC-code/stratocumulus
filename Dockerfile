FROM python:3.8-slim-buster

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY ./server/ ./
CMD ["gunicorn", "stratocumulus:app", "--worker-class", "gevent", "--bind", "0.0.0.0:8000"]

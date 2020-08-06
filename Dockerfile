FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y python3.7 && \
    apt-get install -y python3-pip

COPY ./requirements.txt /tmp/requirements.txt

RUN pip3 install -r /tmp/requirements.txt

WORKDIR '/home/web/codes'

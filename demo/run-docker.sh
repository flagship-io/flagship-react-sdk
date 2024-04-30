#!/bin/bash

docker build -t flagship-demo-react-js . && docker run -p  8080:80 flagship-demo-react-js
#!/bin/bash

docker run -v $PWD/docker/mysql/db:/docker-entrypoint-initdb.d -p 3307:3306 --rm --name mysqlfunfunz -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=test_db -d mysql --default-authentication-plugin=mysql_native_password
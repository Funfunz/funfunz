#!/bin/bash

docker run -v $PWD/docker/mongo/northwind:/db -p 27017:27017 -d --rm --name mongofunfunz -it mongo
docker exec --workdir /db mongofunfunz bash -c "sleep 1 && ls -la && mongo Northwind --eval \"printjson(db.dropDatabase())\" && chmod +x mongo-import.sh && ./mongo-import.sh"
docker exec --workdir /db mongofunfunz bash -c "mongo admin --eval \"db.createUser({user: 'admin',pwd: 'password',roles: [{ role: 'userAdminAnyDatabase', db:'admin'}]})\""
docker restart mongofunfunz
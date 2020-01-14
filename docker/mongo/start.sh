#!/bin/bash

docker run -v $PWD/docker/mongo/northwind:/db -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -d --rm --name mongofunfunz -it mongo
docker exec --workdir /db mongofunfunz bash -c "sleep 3 && mongo -u admin -p password --authenticationDatabase admin Northwind --eval 'printjson(db.dropDatabase())' && chmod +x mongo-import.sh && ./mongo-import.sh"
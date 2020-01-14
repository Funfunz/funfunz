#!/bin/bash

docker exec --workdir /db funfunzmc_mongo_1 bash -c "sleep 3 && mongo -u admin -p password --authenticationDatabase admin Northwind --eval 'printjson(db.dropDatabase())' && chmod +x mongo-import.sh && ./mongo-import.sh"
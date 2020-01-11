#!/bin/bash

docker run --mount type=bind,source=/Users/joaomoura/Repos/personal/funfunzmc/docker/mongo/northwind,target=/db -p 27017:27017 -d --rm --name mongofunfunz -it mongodb
docker exec mongofunfunz bash -c "sleep 1 && mongo Northwind --eval \"printjson(db.dropDatabase())\" && chmod +x /db/mongo-import.sh && ./mongo-import.sh"
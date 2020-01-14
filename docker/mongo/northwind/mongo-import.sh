echo "hello"
for f in *.csv
do
    filename=$(basename "$f")
    extension="${filename##*.}"
    filename="${filename%.*}"
    mongoimport --username=admin --password=password --authenticationDatabase admin -d Northwind -c "$filename" --type csv --file "$f" --headerline
done
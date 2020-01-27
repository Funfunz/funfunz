# funfunzmc docs

## requirements

python >= 2.7
pip >= 1.5.2

## hosted at
https://jwebcoder.github.io/funfunzmc/

## installation

run `pip install -r requirements.txt`

## running the docs

`mkdocs serve`

## build the docs

`mkdocs build && rm -rf ../docs/* && cp -r site/* ../docs/`

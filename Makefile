SHELL:=/bin/bash
PATH:=./node_modules/.bin:$(PATH)

SRC:=$(shell find -regex '/^.*(html|js|json|css)$$/')

build: node_modules $(SRC)
	mkdir -p $@
	cp index.html $@/
	atomify

node_modules: package.json
	npm install

clean:
	rm -fr build

.PHONY: build clean

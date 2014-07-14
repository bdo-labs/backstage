
#
# Preferences
#

REPORTERS?=progress
OUT_DIR?=build

#
# Environment
#

SHELL:=/bin/bash
PATH:=./node_modules/.bin:$(PATH)


#
# Source
#

SRC:=$(shell find -E lib -regex '^.*(html|js|css)$$')


#
# Targets
#

all: $(OUT_DIR)

$(OUT_DIR): node_modules $(SRC)
	mkdir -p $@
	cp index.html $@/
	atomify --output $@/bundle

node_modules: package.json
	npm install

clean:
	rm -fr $(OUT_DIR)

test: $(OUT_DIR)
	karma start --reporters $(REPORTERS)

.PHONY: clean test


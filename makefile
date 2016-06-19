.PHONY: clean install all

LOCAL_MODULES = ./node_modules/.bin/

all: test

clean:
	rm -rf built dist

install: clean
	mkdir -p built dist
	$(LOCAL_MODULES)/tsc
	$(LOCAL_MODULES)/browserify built/browser.js --outfile dist/up.js

test: install
	npm test


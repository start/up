.PHONY: clean install all

all: test

clean:
	rm -rf built dist

install: clean
	mkdir -p built dist
	tsc
	browserify built/for-browser.js --outfile dist/up.js

test: install
	npm test


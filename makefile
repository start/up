.PHONY: clean install all

all: test

clean:
	rm -rf built

install: clean
	mkdir built
	tsc

test: install
	npm test


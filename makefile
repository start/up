.PHONY: clean install all

all: install

clean:
	rm -rf built

install: clean
	mkdir built
	tsc


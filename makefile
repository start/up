.PHONY: clean install all test package

BUILT = built
FOR_BROWSER = for-browser

LOCAL_MODULES = ./node_modules/.bin/

all: test

clean:
	rm -rf $(BUILT) $(FOR_BROWSER) 

install: clean
	mkdir $(BUILT)
	$(LOCAL_MODULES)/tsc

test: install
	npm test

package: test
	mkdir $(FOR_BROWSER)
	$(LOCAL_MODULES)/browserify $(BUILT)/browser.js --outfile $(FOR_BROWSER)/up.js


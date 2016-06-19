.PHONY: clean install all test package

BUILT = built
FOR_BROWSER = for-browser
LIB = lib

LOCAL_MODULES = ./node_modules/.bin/

all: package

clean:
	rm -rf $(BUILT) $(FOR_BROWSER) $(LIB) 

install: clean
	mkdir $(BUILT)
	$(LOCAL_MODULES)/tsc

test: install
	npm test

package: test
	mkdir $(FOR_BROWSER) $(LIB)
	$(LOCAL_MODULES)/browserify $(BUILT)/browser.js --outfile $(FOR_BROWSER)/up.js
	
# Copy all JavaScript files and TypeScript type declaration files to the `lib` directory.
#
# We include a trailing slash after the `built` directory to ensure its contents are copied
# directly into `lib`, instead of into a `built` directory inside of `lib`. 
	rsync -am --include='*.js' --include='*.d.ts' --include='*/' --exclude='*' $(BUILT)/ $(LIB)
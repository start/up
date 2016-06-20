.PHONY: clean build all test

BUILT = built
FOR_BROWSER = for-browser
LIB = lib

LOCAL_MODULES = ./node_modules/.bin/

all: test

clean:
	rm -rf $(BUILT) $(FOR_BROWSER) $(LIB) 

build: clean
	mkdir $(BUILT) $(FOR_BROWSER) $(LIB)
	$(LOCAL_MODULES)/tsc
	$(LOCAL_MODULES)/browserify $(BUILT)/browser.js --outfile $(FOR_BROWSER)/up.js

# Copy all JavaScript files and TypeScript type declaration files to the `lib` directory.
#
# We include a trailing slash after the `built` directory to ensure its contents are copied
# directly into `lib`, instead of into a `built` directory inside of `lib`. 
	rsync -am --include='*.js' --include='*.d.ts' --include='*/' --exclude='*' $(BUILT)/ $(LIB)

# Delete any code from the `lib` directory that doesn't need to be published to npm
	rm -rf $(LIB)/{Test,browser.{js,d.ts}}

test: build
	npm test

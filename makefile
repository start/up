.PHONY: all clean build test

local_modules_dir = ./node_modules/.bin

compiled_dir = compiled
bower_publish_dir = for-browser
npm_publish_dir = lib

all_our_build_dirs = $(compiled_dir) $(bower_publish_dir) $(npm_publish_dir)

all: test

clean:
	rm -rf $(all_our_build_dirs) 

build: clean
	mkdir $(all_our_build_dirs)	
	$(local_modules_dir)/tsc
	$(local_modules_dir)/browserify $(compiled_dir)/browser.js --outfile $(bower_publish_dir)/up.js

# Copy all JavaScript files and TypeScript type declaration files to `npm_publish_dir`.
#
# We include a trailing slash after `compiled_dir` to ensure only its contents are copied (instead of itself).
	rsync -am --include='*.js' --include='*.d.ts' --include='*/' --exclude='*' $(compiled_dir)/ $(npm_publish_dir)

# Delete any code from `npm_publish_dir` that doesn't need to be published to npm.
	rm -rf $(npm_publish_dir)/{Test,browser.{js,d.ts}}

test: build
	npm test

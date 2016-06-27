.PHONY: all clean build test


local_modules_dir = ./node_modules/.bin

compiled_dir = compiled
npm_publish_dir = lib

all_our_build_dirs = $(compiled_dir) $(npm_publish_dir)


all: test

clean:
	rm -rf $(all_our_build_dirs)

build: clean
	npm install
	mkdir $(all_our_build_dirs)

# Compile!
	$(local_modules_dir)/tsc

# Copy all JavaScript files and TypeScript type declaration files to `npm_publish_dir`.
#
# We include a trailing slash after `compiled_dir` to ensure only its contents are copied (instead of itself).
	rsync -am --include='*.js' --include='*.d.ts' --include='*/' --exclude='*' $(compiled_dir)/ $(npm_publish_dir)

# We don't need to publish our tests to npm.
	rm -rf $(npm_publish_dir)/Test

test: build
	npm test

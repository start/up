local_modules_dir = ./node_modules/.bin

compiled_dir = compiled
npm_publish_dir = lib

all_our_build_dirs = $(compiled_dir) $(npm_publish_dir)

# Our behavioral unit tests describe the behavior of the Up library.
#
# We also have package unit tests, which describe how the Up library is exported. For more information, see
# the `report` target.
mocha_args_for_behavioral_tests = --recursive ./compiled/Test


.PHONY: all
all: test


.PHONY: clean
clean:
	rm -rf $(all_our_build_dirs)


.PHONY: build 
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


.PHONY: test
test: build
# Run all behavioral and package unit tests.
	$(local_modules_dir)/mocha $(mocha_args_for_behavioral_tests) ./package-tests.js


.PHONY: report
report: build
# For now, all our 1000+ behavioral unit tests are run against `compiled_dir`.
#
# However, our handful of package tests (in `package-tests.js`) are run against `npm_publish_dir`. If we ask
# istanbul to run those package tests, we get an unhelpful coverage summary, because istanbul doesn't realize
# `npm_publish_dir` is copied from `compiled_dir`.  
	$(local_modules_dir)/istanbul cover _mocha -- $(mocha_args_for_behavioral_tests)
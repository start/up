local_modules_dir = ./node_modules/.bin

compiled_dir = compiled
dist_dir = dist

all_our_build_dirs = $(compiled_dir) $(dist_dir)

# Our behavioral unit tests describe the behavior of the Up library.
#
# We also have a different set of tests that describe the exports of our distributable
# JavaScript module (the one produced by this build process).
#
# For more information on why this distinction is important, see the `coverage` target.
mocha_args_for_behavioral_tests = --recursive ./compiled/Test

local_mocha = $(local_modules_dir)/mocha


.PHONY: all
all: install test


.PHONY: install
install:
	npm update


.PHONY: clean
clean:
	rm -rf $(all_our_build_dirs)


.PHONY: compile 
compile: clean
	mkdir $(all_our_build_dirs)

# Compile!
	$(local_modules_dir)/tsc

# Copy all JavaScript files and TypeScript type declaration files to `dist_dir`.
#
# We include a trailing slash after `compiled_dir` to ensure only its contents are copied (instead of itself).
	rsync -am --include='*.js' --include='*.d.ts' --include='*/' --exclude='*' $(compiled_dir)/ $(dist_dir)

# We don't need to distribute any tests.
	rm -rf $(dist_dir)/Test


.PHONY: test
test: compile
# Run all behavioral unit tests.
	$(local_mocha) $(mocha_args_for_behavioral_tests)

# Run all export unit tests. These tests have timed out on Travis CI before, so we specify a larger timeout.
	$(local_mocha) ./describe-exports-of-js-module.js --timeout 3000


.PHONY: coverage
coverage: compile
# We want istanbul to run only our behavioral unit tests. Why?
#
# Well, for now, all 2000+ behavioral unit tests are run against `compiled_dir`. On the other hand, our handful
# of export unit tests are run against `dist_dir`. If we were to have istanbul run our export tests, we'd
# get an unhelpful test coverage summary, because istanbul doesn't realize that `dist_dir` is copied from
# `compiled_dir`.
	$(local_modules_dir)/istanbul cover $(local_modules_dir)/_mocha -- $(mocha_args_for_behavioral_tests)


.PHONY: lint
lint: compile
# Lint all our TypeScript source code.
	find src -name "*.ts" | xargs $(local_modules_dir)/tslint --out lint-warnings.txt

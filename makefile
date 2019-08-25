local_modules_dir = ./node_modules/.bin

# TODO: Rethink directory structure.
all_our_build_dirs = compiled dist

local_mocha = $(local_modules_dir)/mocha

# Our behavioral tests describe the behavior of the Up library.
#
# We also have a different set of tests to verify package.json settings.
#
# For more information on why this distinction is important, see the `coverage` target.
mocha_args_for_behavioral_tests = --recursive ./compiled/Test


.PHONY: all
all: install test


.PHONY: install
install:
	npm install


.PHONY: clean
clean:
	rm -rf $(all_our_build_dirs)


.PHONY: compile 
compile: clean
	mkdir $(all_our_build_dirs)

# Compile!
	$(local_modules_dir)/tsc

# Copy all JavaScript files and TypeScript type declaration files to `dist`.
#
# We include a trailing slash after `compiled` to ensure only its contents are copied (instead of itself).
	rsync -am --include='*.js' --include='*.d.ts' --include='*/' --exclude='*' compiled/ dist

# We don't need to distribute any tests.
	rm -rf dist/Test


.PHONY: test
test: compile
# Run our behavioral tests.
	$(local_mocha) $(mocha_args_for_behavioral_tests)

# Verify package.json settings.
	$(local_mocha) ./verify-package-settings.js


.PHONY: coverage
coverage: compile
# Istanbul produces an HTML file for every JavaScript file it touches during unit testing. It does not delete
# any of its previous summary files.
#
# To avoid cluttering up search results with coverage summaries for renamed/removed files, we delete the
# coverage folder each time we produce a new summary.     
	rm -rf coverage

# We want istanbul to only run our behavioral unit tests. Why?
#
# All 2000+ behavioral unit tests are run against `./compiled`. On the other hand, our tests for verifying
# package.json settings are run against `./dist`. If we were to have istanbul run the package.json tests,
# we'd get an unhelpful test coverage summary, because istanbul doesn't realize that `./dist` is copied from
# `./compiled`.
	$(local_modules_dir)/istanbul cover $(local_modules_dir)/_mocha -- $(mocha_args_for_behavioral_tests)


.PHONY: lint
lint: compile
# Lint all our TypeScript source code.
	find src -name "*.ts" | xargs $(local_modules_dir)/tslint --out lint-warnings.txt --fix

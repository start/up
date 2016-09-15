local_modules_dir = ./node_modules/.bin

src_dir = src
compiled_dir = compiled
dist_dir = dist

all_our_build_dirs = $(compiled_dir) $(dist_dir)

mocha_args = --recursive ./compiled/Test

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
	$(local_mocha) $(mocha_args)


.PHONY: coverage
coverage: compile
# Istanbul produces an HTML file for every JavaScript file it touches during unit testing. It does not delete
# any of its previous summary files.
#
# To avoid cluttering up search results with coverage summaries for renamed/removed files, we delete the
# coverage folder each time we produce a new summary.     
	rm -rf coverage
	$(local_modules_dir)/istanbul cover $(local_modules_dir)/_mocha -- $(mocha_args)


.PHONY: lint
lint: compile
# Lint all our TypeScript source code.
	find src -name "*.ts" | xargs $(local_modules_dir)/tslint --out lint-warnings.txt

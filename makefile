local_modules_dir = ./node_modules/.bin

# TODO: Rethink directory structure.
all_our_build_dirs = compiled dist

local_mocha = $(local_modules_dir)/mocha

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
	$(local_mocha) --recursive ./compiled/Test

# Verify package.json settings.
	$(local_mocha) ./verify-package-settings.js

.PHONY: lint
lint: compile
# Lint all our TypeScript source code.
	find src -name "*.ts" | xargs $(local_modules_dir)/tslint --out lint-warnings.txt --fix

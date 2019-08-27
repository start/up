local_modules_dir = ./node_modules/.bin
local_mocha = $(local_modules_dir)/mocha


.PHONY: all
all: install test


.PHONY: install
install:
	npm install


.PHONY: clean
clean:
	rm -rf compiled


.PHONY: compile 
compile: clean
	mkdir compiled

# Compile!
	$(local_modules_dir)/tsc


.PHONY: test
test: compile
# Run our behavioral tests.
	$(local_mocha) --recursive ./compiled/Test

# Verify package.json settings.
	$(local_mocha) ./verify-package-settings.js


.PHONY: lint
lint: compile
# Lint all our TypeScript source code.
	$(local_modules_dir)/tslint --out lint-warnings.txt --fix --project .

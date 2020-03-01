install:
	npm install

lint:
	npx eslint .

test:
	npm run test

build:
	npx babel src --out-dir dist

publish:
	npm publish --dry-run

start:
	npx node src/index.js;
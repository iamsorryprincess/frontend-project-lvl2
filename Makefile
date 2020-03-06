install:
	npm install

lint:
	npx eslint .

test:
	npm run test

publish:
	npm publish --dry-run

start:
	npx node src/index.js;
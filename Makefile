install:
	npm install

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage

test:
	npm run test

publish:
	npm publish --dry-run

start:
	npx node src/index.js;
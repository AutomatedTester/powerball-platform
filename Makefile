test:
	mocha tests/* --globals name --reporter spec

deploy:
	git push micro master

push:
	git push origin master

run:
	nodemon app.js

setup:
	npm install

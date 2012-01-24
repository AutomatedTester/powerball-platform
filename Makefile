.PHONY: help test deploy push run setup

help:
	@echo "Please use 'make <target>' where target is one of the following"
	@echo "  test		to run all the tests"
	@echo "  deploy        to the production server. This requires that the git remote has been added"
	@echo "  push		runs 'git push origin master'"
	@echo "  run		starts the webserver up"
	@echo "  setup		sets the environment up"


test:
	mocha tests/* --globals name --reporter spec -t 20000

deploy:
	git push micro master

push:
	git push origin master

run:
	nodemon app.js

setup:
	npm install

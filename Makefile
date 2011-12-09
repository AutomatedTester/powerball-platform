test:
	mocha tests/* --globals name --reporter spec

deploy:
	git push micro master

push:
	git push origin master

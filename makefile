git:
	git reset --hard HEAD 
	git pull
	git status
	npm i
build:
	nest build
start:
	pm2 start dist/main.js --name server
all:
	sudo make git
	sudo make build
	pm2 restart server
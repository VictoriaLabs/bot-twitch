APPLICATION_NAME ?= twitch-bot
CONTAINER_NAME ?= twitch-bot-container
PORT ?= 8000

install: 
	docker build -t ${APPLICATION_NAME} .

build:
	docker image rm ${APPLICATION_NAME}
	docker build -t ${APPLICATION_NAME} .

run:
	docker run -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${APPLICATION_NAME}

stop:
	docker stop ${CONTAINER_NAME}
	docker rm ${CONTAINER_NAME}

restart:
	docker stop ${CONTAINER_NAME}
	docker rm ${CONTAINER_NAME}
	docker run -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${APPLICATION_NAME}

quickStart:
	npm i
	node app.ts
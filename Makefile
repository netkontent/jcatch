build:
	${GOPATH}/bin/dep ensure
	env GOOS=linux go build -o ./bin/status ./src/go/status/main.go
	elm-app build

local:
	${GOPATH}/bin/dep ensure
	env GOOS=linux go build -o ./bin/status ./src/go/status/main.go
	elm-app start

init:
	${GOPATH}/bin/dep init -v

.PHONY: clean
clean:
	rm ./bin/status

.PHONY: deploy
deploy: clean build
	sls deploy --stage $(stage) --region eu-west-1 --aws-profile $(profile) --verbose
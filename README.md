# lnF

## Pre-Requisite

Run `phoenixd` docker with network `lnf`

## Run api

Create file .env

```env
API_URL=http://phoenixd:9740
API_KEY=phoenixd_password
PINS=xxxxxx,yyyyyy
LINE_NOTIFY_TOKEN=xxxxxx # optional
```

```sh
docker run --name lnf-api -d --network lnf --restart unless-stopped --env-file .env -v {DATA_PATH}:/app/db ghcr.io/dnjooiopa/lnf-api
```

## Run web

```sh
docker run --name lnf-web -dp 9730:3000 --network lnf --restart unless-stopped ghcr.io/dnjooiopa/lnf-web
```

## Auto update

```sh
docker rm -f lnf-web
docker rm -f lnf-api

docker rmi ghcr.io/dnjooiopa/lnf-web
docker rmi ghcr.io/dnjooiopa/lnf-api

docker run --name lnf-api -d --network lnf --restart unless-stopped --env-file .env -v {DATA_PATH}:/app/db ghcr.io/dnjooiopa/lnf-api

docker run --name lnf-web -dp 9730:3000 --network lnf --restart unless-stopped ghcr.io/dnjooiopa/lnf-web
```

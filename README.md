## Node.js + Postgres

### Requirements

* Node.js v8+ or Docker and Docker Compose
* Postgres running on local instance or Docker

### Running on localMachine

* Install dependencies - `npm i`
* Run project - `npm start`

### OR: Docker

* `docker-compose up`

```shell
docker run -d -p 5432:5432 --name postgres \
    --env POSTGRES_PASSWORD=mypasswd \
    --env POSTGRES_DB=TrueToSizeData\
    postgres
```

```shell
docker run -p 3001:3001 \
    --link postgres:postgres \
    -e POSTGRES_HOST=postgres:mypasswd@postgres:5432 \
    -e POSTGRES_DB=TrueToSizeData \
    -e POSTGRES_SSL=false \
    ovodocker/stockx:latest
```

### Viewing

* Go to swagger page - `localhost:3001/documentation`

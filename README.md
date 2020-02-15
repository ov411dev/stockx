## Node.js + Postgres

### Requirements

* Node.js v8+ or Docker and Docker Compose
* Postgres running on local instance or Docker

### Running on localMachine

* Install dependencies - `npm i`
* Run project - `npm start`

### Docker

* `docker-compose up`

### OR: Docker one by one
```
docker run -d -p 5432:5432 --name postgres \
    --env POSTGRES_PASSWORD=mypasswd \
    --env POSTGRES_DB=TrueToSizeData\
    postgres
```
```
#test connection
psql postgresql://postgres:mypasswd@localhost:5432/TrueToSizeData
```
```
docker run -p 3001:3001 \
    --link postgres:postgres \
    -e POSTGRES_HOST=postgres:mypasswd@postgres:5432 \
    -e POSTGRES_DB=TrueToSizeData \
    -e POSTGRES_SSL=false \
    ovodocker/stockx:latest
```
### Viewing

* Go to swagger page - `localhost:3001/documentation`
```
Post multiple true-to-size entries by
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "product_id": 1,
  "size_fit": 3
}' 'http://localhost:3001/tts'

assume Yeezys product_id is 1
size_fit: integers from 1 to 5
```
```
You can use Postman to easily populate the entries.
Set size_fit variable in the request body
{
  "product_id": 1,
  "size_fit": {{size_fit}}
}
Then in Pre-request Script set
pm.environment.set('size_fit', _.random(1, 5))

And finally run a Collection Runner with desired number of entries
```
```
Check TrueToSizeCalculation by calling
curl -X GET --header 'Accept: application/json' 'http://localhost:3001/tts/1'
```
# bring

a node.js dummy project

# Steps

## Setup

`npm install`

## Environment file

You should create a file named `.env` in order to work with the project. Please take a look at `.env.example`

## Test

`npm test`

Disclaimer: Currently the test runs on the example database and assumes the response is given by the already working MongoDB URL. It should be converted to a local test database.

## Development

`npm run start:dev`

## Docker (Production env)

`docker-compose up`

# How it works

## Endpoint

https://bring-nodejs.herokuapp.com/

### Example Request

```bash
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{"startDate":"2017-01-28", "endDate": "2017-01-30", "minCount": 100, "maxCount": 150}' \
     https://bring-nodejs.herokuapp.com/
```

### Example Response

```json
{
  "code": 0,
  "msg": "Success",
  "results": [
    {
      "key": "TAKwGc6Jr4i8Z487",
      "createdAt": "2017-01-28T01:22:14.398Z",
      "totalCount": 120
    }
  ]
}
```

Author: Emin Bugra Saral

# Roman Numeral Converter Service
Webservice that is primarily concerned with operations related to Roman numerals, such as converting integers to Roman numerals.

## Dependencies

### OpenAPI/Swagger
By using OpenAPI, we ensure downstream services, uis, and other may communicate with our service via a well defined contract.

For example, the roman-numeral-ui generates it's client using the generated open-api spec.

We use swagger annotations to decorate our controllers and models, so that we may generate the openapi spec from code.  This helps ensure our code and spec stay in sync.

#### OpenAPI spec generation
The OpenAPI spec is generated when we start the service, and written to src/roman-numeral-openapi-spec.json

## Dev Setup
Install node.js and dependencies
```shell
brew install node
npm install
```

## Running The Service
To run the service locally, run:
```shell
npm run start:dev
```

### Running with Docker
Ensure you have docker desktop installed.

See package.json for running in other environments.

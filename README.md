# Roman Numeral Converter Service
Webservice that is primarily concerned with operations related to Roman numerals, such as converting integers to Roman numerals.

## Dependencies

### Nest.js
Nest.js is a modular framework built in TypeScript on top of Express, which is decorator-driven, allowing us to declaratively define behavior and structure for our classes, methods, and properties.

### DataDog
We use DataDog to accomplish the objective of 3 pillars of observability: Metrics, Logs, Traces

#### Dashboards

##### APM 
###### Services Explorer
We can see our roman numeral service's requests, errors, p99, p50, etc latency
![img_1.png](img_1.png)

###### Runtime Metrics
We can see our cpu usage, memory usage, heap space, garbage collection pause time, etc on the Node Runtime Metrics Dashboard.
![img_2.png](img_2.png)

###### Traces Explorer
We can see our spans (convertIntegerToRomanNumeral, etc) in the APM Traces Explorer, along with breakdowns of
![img.png](img.png)

###### Logs Explorer
We can see our logs from our service, including log messages, request headers, etc
![img_3.png](img_3.png)

### nestjs-ddtrace
Makes it easier to integrate nestjs and DataDog

#### span
A span is a granular, traceable record of an operation in our code.
They help us visualize, measure, and diagnose individual steps with a distributed request, giving us end to end observability.

##### tag
A key value pair of metadata added to a span, which allow us to attach additional info that is searchable. 
e.g. user ids, request params, operation types, or results.

### nestjs-pino
Platform agnostic logger for nestjs, base on Pino, with request context in every log.

### OpenAPI/Swagger
By using OpenAPI, we ensure downstream services, uis, and other may communicate with our service via a well defined contract.

For example, the roman-numeral-ui generates it's client using the generated open-api spec.

We use swagger annotations to decorate our controllers and models, so that we may generate the openapi spec from code.  This helps ensure our code and spec stay in sync.

#### OpenAPI spec generation
The OpenAPI spec is generated when we start the service, and written to src/roman-numeral-openapi-spec.json

#### API Docs
The api docs can be viewed a the /api endpoint, and allow for viewing and trying out the various endpoints.
http://localhost:1337/api
![img_4.png](img_4.png)
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

#### datadog agent
If you want local spans, logs, etc to go to datatog, you'll need to run the datadog-agent container

```shell
docker run -d --name dd-agent \
  -e DD_API_KEY=<api key> \
  -e DD_SITE="us5.datadoghq.com" \
  -e DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true \
  -e DD_LOGS_ENABLED=true \
  -p 8126:8126 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /proc/:/host/proc/:ro \
  -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
  -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
  -v /tmp/roman-numeral-service.log:/var/log/roman-numeral-service.log:ro \
  -v /tmp/roman-numeral-service.d:/conf.d/roman-numeral-service.d:ro \
  gcr.io/datadoghq/agent:7
```

Useful command to see if APM, Logs, etc are running and receiving input:
```shell
docker exec -it dd-agent agent status
```

To get logs working from local process outside of docker:
```shell
mkdir -p /tmp/roman-numeral-service.d

cat > /tmp/roman-numeral-service.d/conf.yaml <<EOF
logs:
  - type: file
    path: /var/log/roman-numeral-service.log
    service: roman-numeral-service
    source: nodejs
EOF


```
## Client Generation
To help ensure our service behaves as expected, as well as ensure our schemas are properly defined, we generate a typescript client
from our generated roman-numeral-openapi-spec.json, and the run tests using the generated client.

### Generating the Client

```shell
npm run generate-client
```
The generated client can be found under src/clients/roman-numeral-client

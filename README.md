# js-http-fetch

## Fetch-based http request plugin, just fetch, no XMLHttpRequest.

## Install

Use npm:

```shell
$ npm i js-http-fetch -S
```

Use yarn:

```shell
yarn add js-http-fetch
```

Use unpkg CDN:

```html

<script src="https://unpkg.com/js-http-fetch/lib/js-http-fetch.min.js"></script>
```

## Examples

First, import or require or link the module.

Use es6 module:

```js
import HttpFetch from 'js-http-fetch';

HttpFetch('/url').then(res => console.log(res));
```

Use commonJs:

```js
const HttpFetch = require('js-http-fetch');

HttpFetch('/url').then(res => console.log(res));
```

Use link:

```html

<script src="https://unpkg.com/js-http-fetch/lib/js-http-fetch.min.js"></script>

<script>
  window.HttpFetch('/url').then(res => console.log(res));
</script>
```

## Create Instance

### HttpFetch.create([[config](#configHttpFetchconfig)])

You can create an instance of `HttpFetch`, and the instance will inherit the [config](#configHttpFetchconfig) of `HttpFetch` and the [request methods](#request-methods) from `Fetch`. The created instance is
no different from the use of `HttpFetch` except that there is no `create` method.

```js
const base = 'http://someurl';
HttpFetch.config.base = base;
const http = HttpFetch.create();
console.log(http.config.base === base); // expect: true
```

```js
// You can also pass in a config object as the initial configuration of the instance and override the configuration of HttpFetch.
HttpFetch.config.base = 'http://oldurl';
HttpFetch.config.timeout = 5000;
const http = HttpFetch.create({
  base: 'http://newurl',
  timeout: 10000
});
console.log(http.config.base === 'http://newurl' && http.config.timeout === 10000); // expect: true
```

[See all the configs.](#configHttpFetchconfig)

## Request Methods

**All requests return <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">Promise</a>**, this may cause some compatibility issues.

### HttpFetch([[url](#url),] [config](#configHttpFetchconfig))

```js
// HttpFetch is a function.
HttpFetch('/', {data: {id: 1}, params: {title: 'tom'}});
HttpFetch({
  url: '/',
  method: 'post',
  data: {id: 1},
  params: {
    title: 'tom',
  },
  headers: {}
});
```

### HttpFetch.get([url](#url)[, [params](#params)[, [config](#configHttpFetchconfig)]])

```js
// If params is provided, it will be parsed as URLSearchParams spliced to the request url, just like passing parameters in GET mode.
// The config will override the instance's config(HttpFetch.config).
HttpFetch.get('/');
HttpFetch.get('http://api', {id: 5}); // expect url: http://api?id=5 
HttpFetch.get('/', {id: 5}, {timeout: 3000});
```

### HttpFetch.post([url](#url)[, [data](#data)[, [config](#configHttpFetchconfig)]])

```js
// If data is an object or array, or number, or boolean, the Content-Type will be set application/json if you do not set it, and data will be converted to String type, other Content-Type that are judged by default for fetch.
HttpFetch.post('/');
HttpFetch.post('/', {id: 5});
HttpFetch.post('/', null, {timeout: 3000}); // the request body will be empty
```

### HttpFetch.delete([url](#url)[, [params](#params)[, [config](#configHttpFetchconfig)]])

```js
// The params has the same meaning as the get method.
HttpFetch.delete('/', {}, {responseType: 'json'});
```

### HttpFetch.patch([url](#url)[, [data](#data)[, [config](#configHttpFetchconfig)]])

```js
// The data has the same meaning as the post method.
HttpFetch.patch('/', {}, {});
```

### HttpFetch.put([url](#url)[, [data](#data)[, [config](#configHttpFetchconfig)]])

```js
// The data has the same meaning as the post method.
HttpFetch.put('/', {}, {});
```

### HttpFetch.options([url](#url)[, [params](#params)[, [config](#configHttpFetchconfig)]])

```js
// The params has the same meaning as the get method.
HttpFetch.options('/', {}, {});
```

### HttpFetch.head([url](#url)[, [params](#params)[, [config](#configHttpFetchconfig)]])

```js
// The params has the same meaning as the get method.
HttpFetch.head('/', {}, {});
```

## Config(HttpFetch.config)

### set config

```js
// You can directly assign values to the config of HttpFetch or HttpFetch instance to change the configuration.
Object.assign(HttpFetch.config, /*your-config*/);
```

### url

```ts
// type: string
```

The requested `url`, if the `base` is configured and the `url` is not absolute, the `base` and `url` will be concatenated as the complete `url` when requesting.

### base

```ts
// type: string
```

The basic `url` of the request, which will be spliced with the `url` as the complete `url` when sending the request.

### data

```ts
// type: Blob | BufferSource | FormData | URLSearchParams | ReadableStream<Uint8Array> | string | Record<string, any> | Array<any> | number | boolean | null
```

If `data` is one of `Record<string, any> | Array<any> | number | boolean`, will be converted to a json string. And if `Content-Type` is not set, will be automatically set to `application/json`. After
the `data` is processed, it will be passed into `fetch` as the `body`, that is, the request body.

### params

```ts
// type: Array<string> | Record<string, string>
```

The `params` will be serialized into query string format and spliced into `url`, refer to `get` request.

```js
HttpFetch({url: 'http://api', params: ['5', '7']}); // expect url: http://api?0=5&1=7
HttpFetch({url: 'http://api', params: {a: '3', b: '6'}}); // expect url: http://api?a=3&b=6
```

### timeout

```ts
// type: number
```

Set the timeout time of the request, if the request time is longer than this time, the request will be interrupted. If `timeout` is 0 or not set, the request will not be aborted.

### method

```ts
// type: 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH'
```

The way to send the request, when the request is finally sent, the `method` will be converted to uppercase.

### controller

```ts
// type: AbortController
```

The `controller` used to abort the request, if you need to manually abort the request, please pass `controller` instead of `fetch`'s `signal`, because the abort request of `timeout` uses the
same `controller`. **If multiple requests use the same `controller`, be aware of the impact of manual abort requests on other requests**.

### responseType

```ts
// type: 'arrayBuffer' | 'blob' | 'json' | 'text' | 'formData' | 'stream'
```

Specifies the type of response data. If it is not set, it will try to parse it as `json` by default. If the parsing fails, it will be parsed as `text`
, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank">read more</a>. If it is `stream`, the response will not be processed, instead, directly return
the <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream" target="_blank">ReadableStream</a> returned by`fetch`.

### headers

```ts
// type: Headers | string[][] | Record<string, string>
```

Set request headers. For typescript, headers preset key `Content-Type`.

### onDownloadProgress

```ts
// type: (progress: Progress) => void
```

Hook to get download progress.

## Abort Request

```js
const controller = new AbortController();
HttpFetch.post('/', {}, {controller});
controller.abort(); // expect abort the request
```

## Interceptors

### request interceptors

```ts
// HttpFetch.interceptors.request.use(resolver, rejecter)
```

You can pass in 2 `function`, the first (`resolver`) handles a successful `Promise`, the second (`rejecter`) handles a failed `Promise`. You can directly return a `config` object or a `Promise`. You
can also use multiple `interceptors`, they will execute in sequence (if `Promise`, it will after `resolve` or `reject`).

```js
HttpFetch.interceptors.request.use(config => {
  // config is the config set per request. 
  config.headers = {token: 'my-token'}
  console.log('first')
  return config; // return is necessary, the configuration of the request is ultimately determined by the request interceptor (if exist)
}, reason => {
  console.log(reason);
  return Promise.reject(reason);
});
// the second interceptor
HttpFetch.interceptors.request.use(config => {
  console.log('second')
  return new Promise(resolve => setTimeout(() => resolve(config), 1000));
});
```

### response interceptors

Like `request interceptors`, 2 `function` can also be passed in, but the resolver has 3 parameters.

```ts
// HttpFetch.interceptors.response.use(resolver, rejecter) 
```

```js
HttpFetch.interceptors.response.use((data, response, config) => {
  // data: data returned
  // response: Response object returned by fetch
  // config: configuration for the current request
  return {data, response, config};
}, reason => {
  console.log(reason);
  return Promise.reject(reason);
});
HttpFetch.interceptors.response.use(data => {
  console.log(data); // The data at this time is the result returned by the previous interceptor, and the second parameter response may be undefined at this time.
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
});
```

## TypeScript

For the plugin, it doesn't know what type of `data` is returned, you need to specify it yourself :

```ts
import HttpFetch from "js-http-fetch";
import {HttpFetchConfig} from "js-http-fetch/types/types";

interface FetchResponse {
  data: Array<{ id: number, title: string }>
  response: Response
  config: HttpFetchConfig
}

HttpFetch.interceptors.response.use((data: any, response: Response, config: HttpFetchConfig) => ({data, response, config}));

HttpFetch.post<FetchResponse>('/').then(res => {
  res.data.forEach(({id, title}) => {
    // do something
  });
});
```

## Note

The use design draws on <a href="https://axios-http.com" target="_blank">axios</a>, for more convenient use.

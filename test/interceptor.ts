import {HttpFetchInstance, HttpFetch, HttpFetchConfig} from "../src/types";
import Fetch from "../src/index";

function base() {
  Fetch.config.base = 'http://localhost:3000'
}

// normalRequestInterceptor(Fetch)

// normalRequestInterceptor(Fetch.create())

// errorRequestInterceptor(Fetch)
// errorRequestInterceptor(Fetch.create())

// normalResponseInterceptor(Fetch)

// errorResponseInterceptor(Fetch)
// execToErrorResponseInterceptor(Fetch)

function normalRequestInterceptor(Fetch: HttpFetchInstance) {
  base()
  Fetch.interceptors.request.use(config => {
    config.method = 'post'
    return config
  })
  Fetch.interceptors.request.use(config => {
    (config.headers as any).token = '.token'
    return config
  })
  Fetch.put('')
  console.warn('expected method: POST, headers: {token: \'.token\'}')
}

function errorRequestInterceptor(Fetch: HttpFetchInstance) {
  base()

  interface Ext extends HttpFetchConfig {
    tc: number
  }

  Fetch.interceptors.request.use<Ext>(config => {
    config.tc = 1
    return config
  })
  Fetch.interceptors.request.use<Ext>(config => Promise.reject(config))
  Fetch.interceptors.request.use<Ext, Ext>(config => {
    console.error('should not in')
    return config
  }, e => {
    console.log('tc' in e)
    return Promise.reject(e)
  })
  Fetch.delete('/').then(r => console.error('should not in'), e => console.log('should in', e))
}

function normalResponseInterceptor(Fetch: HttpFetch) {
  base()
  Fetch.interceptors.response.use()
  Fetch.interceptors.response.use(null, undefined)
  Fetch.interceptors.response.use((data, response, config) => {
    console.log(data != undefined, response instanceof Response, config != undefined, 1, data, response, config)
    return new Promise(resolve => setTimeout(() => resolve({data, 'x-response': response, config}), 1000))
  })
  const Fetch2 = Fetch.create()
  Fetch2.interceptors.response.use<{ data: any, 'x-response': Response, config: HttpFetchConfig }>((data, response, config) => {
    console.log('x-response' in data && 'data' in data && 'config' in data, response === undefined, config != undefined, 2, data, response, config)
    return new Promise(resolve => setTimeout(() => resolve(data), 500))
  })
  Fetch2.interceptors.response.use<{ data: any, 'x-response': Response, config: HttpFetchConfig }>((data, response, config) => {
    console.log('x-response' in data && 'data' in data && 'config' in data, response === undefined, config != undefined, 3, data, response, config)
    return {data: data.data, response: data['x-response'], config: data.config}
  })
  Fetch2<any>('/').then(data => console.log('response' in data && 'data' in data && 'config' in data, data))
}

function errorResponseInterceptor(Fetch: HttpFetchInstance) {
  base()
  Fetch.interceptors.response.use(data => Promise.reject(data))
  Fetch.interceptors.response.use(null, e => {
    console.log(true, "e's ts type is HttpFetchResponseError")
    return Promise.reject(e)
  })
  Fetch.interceptors.response.use<null, Record<string, any>>(r => console.error('should not in', r), e => {
    console.dir(e)
    return new Error(JSON.stringify(e))
  })
  Fetch.interceptors.response.use(r => new Promise((resolve, reject) => setTimeout(() => reject(r), 1000)))
  Fetch('/').then(r => console.error('should not in', r), e => console.dir(e))
}

function execToErrorResponseInterceptor(Fetch: HttpFetchInstance) {
  base()
  Fetch.interceptors.request.use(null, undefined)
  Fetch.interceptors.response.use(undefined, null)
  Fetch.interceptors.response.use(data => {
    throw 4
    return data
  })
  Fetch.interceptors.response.use(r => console.error(r), e => console.log(e))
  Fetch.post('/').then(r => console.log(r), e => console.log(e, 'e'))
}

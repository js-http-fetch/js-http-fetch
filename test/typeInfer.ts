import Fetch from "../src/index";
import {HttpFetchConfig, HttpFetchInstance} from "../src/types";

// normal(Fetch)
// withInterceptor(Fetch)

function normal(Fetch: HttpFetchInstance) {
  Fetch.post<{ ok: string }>('http://localhost:3000').then(r => {
    console.log(r.ok)
  })
}


function withInterceptor(Fetch: HttpFetchInstance) {
  interface ExtHttpFetchConfig extends HttpFetchConfig {
    t: number
  }

  Fetch.interceptors.request.use<ExtHttpFetchConfig>(config => {
    config.t = 1
    return config
  }, (e: number) => e)

  Fetch.interceptors.request.use<ExtHttpFetchConfig>(config => {
    console.log('interceptor request', config)
    return config
  })
  Fetch.interceptors.response.use<{ ok: string }>((data, response, config) => {
    return {data, response, config}
  })
  Fetch<{ data: ReadableStream, response: Response, config: HttpFetchConfig }>('http://localhost:3000?a=1', {
    params: {b: 3},
    responseType: 'stream'
  }).then(r => {
    console.log('data: ', r.data)
    console.log('response: ', r.response)
    console.log('config: ', r.config)
    new Response(r.data).text().then(r => console.log(r))
  }, (e: string) => e)
}

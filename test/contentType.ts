import Fetch from "../src/index";
import {HttpFetchInstance, HttpFetchConfig} from "../src/types";

function base() {
  Fetch.config.base = 'http://localhost:3000'
  Fetch.interceptors.response.use(((data, response, config) => ({data, response, config})))
}
// recordHeadersAndContentType(Fetch.create())
// HeadersObj(Fetch)

// HeadersObj(Fetch.create())

function recordHeadersAndContentType(Fetch: HttpFetchInstance) { // headers: Record<string, string>
  base()
  Fetch.post('/', {a: 2}) // expected Content-Type: application/json
  Fetch.post('/', [1, 2]) // expected Content-Type: application/json
  Fetch.post('/', 1) // expected Content-Type: application/json
  Fetch.post('/', null) // expected Content-Type: empty
  Fetch.post('/', 'null') // expected Content-Type: text/plain
  Fetch.post('/', true) // expected Content-Type: application/json
  Fetch.post('/', 'true') // expected Content-Type: text/plain
  Fetch.post('/', 'a=2') // expected Content-Type: text/plain
  Fetch.post('/', new URLSearchParams({a: '2'})) // expected Content-Type: application/x-www-form-urlencoded
  Fetch.post('/', new FormData()) // expected Content-Type: multipart/form-data

  Fetch.config = {headers: {"Content-Type": 'text/plain'}}
  Fetch.post('/', {a: 2}, {headers: {"Content-Type": 'application/json;charset=utf8'}}) // expected Content-Type: application/json;charset=utf8
  Fetch.post('/', [1, 2]) // expected Content-Type: text/plain
  Fetch.post('/', 1, {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}) // expected Content-Type: application/x-www-form-urlencoded
  Fetch.post('/', null, {headers: {"Content-Type": 'multipart/form-data'}}) // expected Content-Type: multipart/form-data
}

function HeadersObj(Fetch: HttpFetchInstance) { // headers: new Headers() | string[][]
  base()
  const str = JSON.stringify
  const headers1 = [['Content-Type', 'application/json']]
  const headers2 = {'Content-Type': 'application/json'}
  Fetch.put<any>('/b', [1], {headers: new Headers({'Content-Type': 'text/plain'})})
    .then(r => console.log(r.config.headers.get('content-type') === 'text/plain'))

  Fetch.patch<any>('/c', {a: 1}, {headers: headers1})
    .then(r => console.log(str(r.config.headers) === str(headers1)))

  Fetch.patch<any>('/d', {b: 2}, {headers: []})
    .then(r => console.log(JSON.stringify(r.config.headers) === JSON.stringify(headers1)))

  Fetch.put<any>('/', {}, {headers: undefined}).then(r => console.log(str(r.config.headers) === str(headers2)))
  Fetch.post<any>('/', true, {headers: null as any}).then(r => console.log(str(r.config.headers) === str(headers2)))
}

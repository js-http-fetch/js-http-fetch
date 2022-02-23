import {HttpFetchInstance, HttpFetch} from "../src/types";
import Fetch from "../src/index";

// createAndExtend(Fetch)

// fnRequest(Fetch)
// fnRequest(Fetch.create())

// Fetch.config.data = {defaultData: 1, defaultData2: 2}
// Fetch.config.params = {defaultParams: 3, defaultParams2: 4}
// attributeRequestCheckDataAndParams(Fetch)
// attributeRequestCheckDataAndParams(Fetch.create())

function fnRequest(Fetch: HttpFetchInstance) {
  console.warn('expected result is in network')
  Fetch({url: '/', params: {p: '2'}}) // expected method: GET, url: http://localhost:8000/?p=2
  Fetch({url: '/', data: {title: 'tc'}, params: {p: '4'}, method: 'POST'}) // expected method: POST, url: http://localhost:8000/?p=4, body: {title: 'tc'}
  Fetch('/bar', {url: '/foo', params: {q: '1'}, method: 'put', data: 5}) // expected method: PUT, url: http://localhost:8000/bar?q=1, body: 5
}

function attributeRequestCheckDataAndParams(Fetch: HttpFetchInstance) {
  console.warn('expected result is in network')
  Fetch.post('http://localhost:3000/bar', '5', {method: 'get', params: {q: '1'}}) // expected method: POST, url: http://localhost:8000/bar?q=1, body: '5', Content-Type: text/plain
  Fetch.post('http://localhost:3000/bar', {p: 3}) // expected method: POST, url: http://localhost:8000/bar, body: {p:3}, Content-Type: application/json
  Fetch.delete('/bar', [5, 3], {data: new URLSearchParams({a: '3'})}) // excepted url: http://localhost:8000/bar?0=5&1=3 Content-Type: application/x-www-form-urlencoded
  Fetch.get('/bar', {a: '4'}, {data: undefined}) // excepted url: http://localhost:8000/bar?a=4, body: no body
  Fetch.options('/bar', null) // excepted url: http://localhost:8000/bar, body: {defaultData: 1, defaultData2: 2}
  Fetch.head('/bar', undefined, {data: null}) // excepted url: http://localhost:8000/bar, body: no body
  Fetch.patch('/bar', undefined) // excepted url: http://localhost:8000/bar?defaultParams=3&defaultParams2=4, body: no body
  Fetch.patch('/bar', null, {params: {b: '2', c: null, d: undefined, f: 6}}) // excepted url: http://localhost:8000/bar?b=2&f=6, body: no body
}

function createAndExtend(Fetch: HttpFetch) {
  const jsonStr = JSON.stringify
  Fetch.config.headers = {header1: '1'}
  const Fetch2 = Fetch.create()
  console.log(jsonStr(Fetch2.config.headers) === jsonStr({header1: '1'}))
  // @ts-ignore
  Fetch2.config.headers.header2 = '2'
  console.log(jsonStr(Fetch.config.headers) === jsonStr({header1: '1'}))
  console.log(jsonStr(Fetch2.config.headers) === jsonStr({header1: '1', header2: '2'}))

  Fetch.config.headers.header3 = '3'
  Fetch.config.onDownloadProgress = () => 1
  Fetch.config.data = [1, 2]
  console.log(jsonStr(Fetch.config.headers) === jsonStr({header1: '1', header3: '3'}))
  const Fetch3 = Fetch.create({headers: {header3: '33'}, onDownloadProgress: () => 2})
  // @ts-ignore
  Fetch3.config.data.push(4)
  console.log(jsonStr(Fetch3.config.headers) === jsonStr({header3: '33'}))
  console.log(jsonStr(Fetch.config.data) === jsonStr([1, 2]))
  console.log(jsonStr(Fetch3.config.data) === jsonStr([1, 2, 4]))

  const Fetch4 = Fetch.create({data: undefined, headers: {}})
  Fetch4.interceptors.request.use(config => {
    console.log(jsonStr(config.headers) === jsonStr({}), jsonStr(config.data) === jsonStr([1, 2]))
    return config
  })
  Fetch4('/', {method: 'post', data: [1, 2]}) // expected headers: {}, data: [1,2]
}

// import Fetch from "../lib/js-http-fetch.esm";
import Fetch from "../src/index";

console.dir(Fetch)

// Cancel request, a controller can only correspond to one request, otherwise it may affect other requests, because timeout also used controller.
// Unless you want to abort multiple requests with one controller.
// const controller = new AbortController()
// Fetch.get('/', {}, {timeout: 1000, controller})
// controller.abort()

// Set timeout and Content-Type, timeout default is undefined, if timeout is 0 or null or undefined, the request will not be aborted.
// Fetch.get('/', {}, {
//   timeout: 1,
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
// })

// If params is provided, it will be parsed as URLSearchParams spliced to the request url, just like passing parameters in GET mode.
// Fetch.post('http://localhost:3000', {data: {a: 2}, params: {p: 1}}) // expected request url: http://localhost:3000/?p=1

// If data is an object or array, or number, or boolean, the Content-Type will be set application/json if you do not set it, and data will be converted to String type, other Content-Type that are judged by default for fetch.
// Fetch.post('http://localhost:3000', {a: 2}) // expected Content-Type: application/json
// Fetch.post('http://localhost:3000', [1, 2]) // expected Content-Type: application/json
// Fetch.post('http://localhost:3000', 'a=2') // expected Content-Type: text/plain
// Fetch.post('http://localhost:3000', new URLSearchParams({a: '2'})) // expected Content-Type: application/x-www-form-urlencoded
// Fetch.post('http://localhost:3000', new FormData()) // expected Content-Type: multipart/form-data

// base url
// Fetch.config.base = 'http://localhost:3000'
// Fetch.post('/url', {data: {a: 2}}) // expected request url: http://localhost:3000/url

// If you provide a full url, it will not be spliced with base
// Fetch.config.base = 'http://localhost:3000'
// Fetch.post('http://other.com/url', {data: {a: 2}}) // expected request url: http://other.com/url

const controller = new AbortController()
Fetch.config.base = 'http://localhost:3000'
let k = ''
for (let i = 0; i < 1000000; i++) k += 'a'
const stream = new Blob([JSON.stringify({[k]: 1})]).stream() as unknown as ReadableStream<Uint8Array>
const reader = stream.getReader()
const request = new Request('https://localhost:5000', {
  // responseType: 'json',
  body: new ReadableStream({
    async start(controller) {
      while (true) {
        const {value, done} = await reader.read()
        if (done) break
        controller.enqueue(value as Uint8Array)
        console.log(value)
      }
      setTimeout(() => {
        controller.enqueue(3)
        console.log('close')
        controller.close()
      }, 1000)
    }
  }).pipeThrough(new TextEncoderStream()),
  // params: {b: '5'},
  // headers: new Headers(),
  method: 'post',
  // timeout: 0,
  // controller,
})
console.log(request)
fetch(request)

// fetch('/ac', {
//   // responseType: 'json',
//   body: new ReadableStream({
//     async start(controller) {
//       // while (true) {
//       // const {value, done} = await reader.read()
//       // if (done) break
//       // console.log(value)
//       // }
//     }
//   }),
//   // params: {b: '5'},
//   headers: {Authorization: '5'},
//   method: 'patch',
//   // timeout: 0,
//   // controller,
// }).then(async r => {
//   // console.log(r)
// })

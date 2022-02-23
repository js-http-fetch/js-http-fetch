import Fetch from "../src/index";
import {HttpFetchInstance} from "../src/types";

// normal(Fetch)

function normal(Fetch: HttpFetchInstance) {
  Fetch.config.base = 'http://localhost:3000'
  Fetch.get('/', null, {responseType: 'arrayBuffer'}).then(r => console.log(r instanceof ArrayBuffer))
  Fetch.get('/', undefined, {responseType: 'blob'}).then(r => console.log(r instanceof Blob))
  Fetch.get('/', undefined, {responseType: 'stream'}).then(r => console.log(r instanceof ReadableStream))
  Fetch.get('/', undefined, {responseType: 'text'}).then(r => console.log(typeof r === 'string'))
  Fetch.get('/', undefined, {responseType: 'json'}).then(r => console.log(r instanceof Object))
}

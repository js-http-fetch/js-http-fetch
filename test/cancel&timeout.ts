import Fetch from "../src/index";

// immediatelyAbort()
// delayAbort()
// timeout()

function immediatelyAbort() {
  const controller = new AbortController()
  Fetch.post('http://localhost:3000', {}, {controller}).then(r => console.error('should not in'), e => console.log('should in', {e}))
  controller.abort() // will not send request
}

function delayAbort() {
  const controller = new AbortController()
  Fetch.post('http://localhost:3000', {}, {controller}).then(r => console.error('should not in'), e => console.log('should in', {e}))
  console.warn('Suppose the server responds in 1000ms')
  setTimeout(() => controller.abort(), 1002)
}

function timeout() {
  console.warn('Suppose the server responds in 1000ms')
  Fetch.post('http://localhost:3000', {}, {timeout: 1}).then(r => console.error('should not in'), e => console.log('should in', {e}))
  Fetch.post('http://localhost:3000', {}, {timeout: 500}).then(r => console.error('should not in'), e => console.log('should in', {e}))
  Fetch.post('http://localhost:3000', {}, {timeout: 1800}).then(r => console.log('should in', r), e => console.error('should not in', {e}))
}

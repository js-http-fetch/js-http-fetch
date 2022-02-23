import {
  ContentType,
  HttpFetchConfig,
  HttpFetchHttpMethod,
  HttpFetchResponseError,
  Progress, ReturnInterceptorResponse,
  TransformMethod
} from "./types";
import {isProduction, type, urlSerialize} from "./utils";
import {makeError} from "./error";

export default function request(config: HttpFetchConfig) {
  if (!isProduction && config.signal) console.error('[HttpFetch warn]: If you want to abort request, please use controller instead signal.')
  if (config.method) config.method = config.method.toUpperCase() as HttpFetchHttpMethod
  const controller = config.controller || new AbortController()
  config.signal = controller.signal
  let url = '' + config.url
  if (!url.startsWith('http') && !url.startsWith('//') && config.base) url = config.base + url
  const {data, params} = config
  if (params != undefined) url = urlSerialize(url, params)
  if (data != undefined) {
    if (['Object', 'Array', 'Boolean', 'Number'].includes(type(data))) { // json
      config.body = JSON.stringify(data)
      if (!config.headers) config.headers = {'Content-Type': ContentType.json}
      else if (type(config.headers) === 'Object') { // Record<string, string>
        if (!config.headers['Content-Type']) config.headers['Content-Type'] = ContentType.json
      } else if (config.headers instanceof Headers) {
        if (!config.headers.has('Content-Type')) config.headers.set('Content-Type', ContentType.json)
      } else if (Array.isArray(config.headers)) { // string[][]
        const headers = config.headers.find(headers => headers[0].toLowerCase() === 'content-type')
        if (!headers) config.headers.push(['Content-Type', ContentType.json])
      } else if (!isProduction) console.error('[HttpFetch warn]: The config headers is invalid, you can set {}, [["Content-Type", "application/json"]], or a instance of Headers')
    } else config.body = data as BodyInit
  }
  return new Promise<ReturnInterceptorResponse>(async (resolve, reject) => {
    try {
      if (config.timeout) setTimeout(() => handleTimeout(controller, reject, config), config.timeout)
      const response = await fetch(url, config)
      if (!response.ok) return makeError(reject, new Error('Fetch failed with status ' + response.status) as HttpFetchResponseError, config, response)
      if (!response.body) return resolve({data: null, response: new Response()})
      const reader = response.body.getReader()
      const total = +(response.headers.get('Content-Length') || 0)
      const progress: Progress = {
        total,
        loaded: 0
      }
      const stream: ReadableStream = new ReadableStream({
        start: async function (controller) {
          try {
            while (true) {
              const {done, value} = await reader.read()
              if (done) break
              controller.enqueue(value)
              progress.loaded += (value as Uint8Array).length
              config.onDownloadProgress && config.onDownloadProgress(progress)
            }
          } catch (e) {
            // handle user aborted
            return makeError(reject, e, config)
          }
          controller.close()
          if (config.responseType === 'stream') return resolve({data: stream, response})
          let data
          try {
            if (['json', 'blob', 'text', 'arrayBuffer', 'formData'].includes(config.responseType as string)) {
              data = await new Response(stream)[config.responseType as TransformMethod]()
            } else {
              data = await new Response(stream).text()
              try {
                data = JSON.parse(data)
              } catch (e) {
              }
            }
          } catch (e) {
            return makeError(reject, new Error('Response parse error') as HttpFetchResponseError, config)
          }
          resolve({data, response})
        }
      })
    } catch (e) {
      // user aborted will in, timeout will in but the promise is already be rejected
      makeError(reject, e, config)
    }
  })
}

function handleTimeout(controller: AbortController, reject: (reason?: any) => void, config: HttpFetchConfig) {
  controller.abort()
  makeError(reject, new Error(`Timeout of ${config.timeout}ms exceeded`) as HttpFetchResponseError, config)
}

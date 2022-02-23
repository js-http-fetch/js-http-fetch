import {
  HttpFetchConfig,
  HttpFetchInterceptorRequestHandler,
  HttpFetchInterceptorResponseHandler,
  HttpFetchResponseResolver,
  HttpFetchResponseRejecter,
  ReturnInterceptorResponse
} from "./types";

export default function interceptor<T>(
  reqInterceptors: HttpFetchInterceptorRequestHandler[],
  request: (init: HttpFetchConfig) => Promise<ReturnInterceptorResponse>,
  resInterceptors: HttpFetchInterceptorResponseHandler[],
  config: HttpFetchConfig
): Promise<T> {
  const response = handleRequestInterceptors(Promise.resolve(config), reqInterceptors).then(_config => request(config = _config))
  return handleResponseInterceptors(response, resInterceptors, config)
}

function handleRequestInterceptors(promise: Promise<HttpFetchConfig>, interceptors: HttpFetchInterceptorRequestHandler[], i = 0): Promise<HttpFetchConfig> {
  if (i === interceptors.length) return promise
  return handleRequestInterceptors(promise.then(interceptors[i], interceptors[i + 1]), interceptors, i + 2)
}

function handleResponseInterceptors<T>(promise: Promise<ReturnInterceptorResponse>, interceptors: HttpFetchInterceptorResponseHandler[], config: HttpFetchConfig): Promise<T> {
  let hasResolver = false, resolved = false
  for (let i = 0; i < interceptors.length; i += 2) {
    const resolver = interceptors[i] as HttpFetchResponseResolver
    if (typeof resolver === 'function') hasResolver = true
    const rejecter = interceptors[i + 1] as HttpFetchResponseRejecter
    promise = promise.then(data => typeof resolver === 'function' ?
        (resolved ?
            resolver(data, data && data.response, config)
            : (resolved = true) && resolver(data.data, data.response, config)
        )
        : data
      , rejecter)
  }
  return hasResolver ? promise as any as Promise<T> : promise.then(({data}) => data)
}

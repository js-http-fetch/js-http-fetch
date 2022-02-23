function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.HttpFetch = factory());
})(this, function () {
  'use strict';

  function interceptor(reqInterceptors, request, resInterceptors, config) {
    const response = handleRequestInterceptors(Promise.resolve(config), reqInterceptors).then(_config => request(config = _config));
    return handleResponseInterceptors(response, resInterceptors, config);
  }

  function handleRequestInterceptors(promise, interceptors, i = 0) {
    if (i === interceptors.length) return promise;
    return handleRequestInterceptors(promise.then(interceptors[i], interceptors[i + 1]), interceptors, i + 2);
  }

  function handleResponseInterceptors(promise, interceptors, config) {
    let hasResolver = false,
        resolved = false;

    for (let i = 0; i < interceptors.length; i += 2) {
      const resolver = interceptors[i];
      if (typeof resolver === 'function') hasResolver = true;
      const rejecter = interceptors[i + 1];
      promise = promise.then(data => typeof resolver === 'function' ? resolved ? resolver(data, data && data.response, config) : (resolved = true) && resolver(data.data, data.response, config) : data, rejecter);
    }

    return hasResolver ? promise : promise.then(({
      data
    }) => data);
  }

  var ContentType;

  (function (ContentType) {
    ContentType["json"] = "application/json";
    ContentType["formData"] = "multipart/form-data";
    ContentType["urlencoded"] = "application/x-www-from-urlencoded";
    ContentType["text"] = "text/plain";
  })(ContentType || (ContentType = {}));

  function deepClone(o) {
    if (typeof o !== 'object') return o;
    if (Array.isArray(o)) return o.map(deepClone);
    const res = {};
    Object.keys(o).forEach(k => res[k] = deepClone(o[k]));
    return res;
  }

  function urlSerialize(url, params) {
    let s = paramsSerialize(params);
    s = s[0] === '&' ? s.slice(1) : s;
    return url + (s ? (url.lastIndexOf('?') > -1 ? '&' : '?') + s : '');
  }

  function paramsSerialize(params, s = '') {
    return typeof params === 'object' ? params != null ? Object.keys(params).reduce((p, c) => p + (params[c] != null ? '&' + c + '=' + paramsSerialize(params[c]) : ''), s) : s : s + params;
  }

  function type(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
  }

  function makeError(reject, error, config, response) {
    error.config = config;
    error.response = response;

    if (response) {
      response.text().then(data => {
        try {
          data = JSON.parse(data);
        } catch (e) {}

        error.data = data;
        reject(error);
      });
    } else reject(error);
  }

  function request(config) {
    if (config.method) config.method = config.method.toUpperCase();
    const controller = config.controller || new AbortController();
    config.signal = controller.signal;
    let url = '' + config.url;
    if (!url.startsWith('http') && !url.startsWith('//') && config.base) url = config.base + url;
    const data = config.data,
          params = config.params;
    if (params != undefined) url = urlSerialize(url, params);

    if (data != undefined) {
      if (['Object', 'Array', 'Boolean', 'Number'].includes(type(data))) {
        // json
        config.body = JSON.stringify(data);
        if (!config.headers) config.headers = {
          'Content-Type': ContentType.json
        };else if (type(config.headers) === 'Object') {
          // Record<string, string>
          if (!config.headers['Content-Type']) config.headers['Content-Type'] = ContentType.json;
        } else if (config.headers instanceof Headers) {
          if (!config.headers.has('Content-Type')) config.headers.set('Content-Type', ContentType.json);
        } else if (Array.isArray(config.headers)) {
          // string[][]
          const headers = config.headers.find(headers => headers[0].toLowerCase() === 'content-type');
          if (!headers) config.headers.push(['Content-Type', ContentType.json]);
        } else ;
      } else config.body = data;
    }

    return new Promise((() => {
      var _ref = _asyncToGenerator(function* (resolve, reject) {
        try {
          if (config.timeout) setTimeout(() => handleTimeout(controller, reject, config), config.timeout);
          const response = yield fetch(url, config);
          if (!response.ok) return makeError(reject, new Error('Fetch failed with status ' + response.status), config, response);
          if (!response.body) return resolve({
            data: null,
            response: new Response()
          });
          const reader = response.body.getReader();
          const total = +(response.headers.get('Content-Length') || 0);
          const progress = {
            total,
            loaded: 0
          };
          const stream = new ReadableStream({
            start: (() => {
              var _ref2 = _asyncToGenerator(function* (controller) {
                try {
                  while (true) {
                    const _yield$reader$read = yield reader.read(),
                          done = _yield$reader$read.done,
                          value = _yield$reader$read.value;

                    if (done) break;
                    controller.enqueue(value);
                    progress.loaded += value.length;
                    config.onDownloadProgress && config.onDownloadProgress(progress);
                  }
                } catch (e) {
                  // handle user aborted
                  return makeError(reject, e, config);
                }

                controller.close();
                if (config.responseType === 'stream') return resolve({
                  data: stream,
                  response
                });
                let data;

                try {
                  if (['json', 'blob', 'text', 'arrayBuffer', 'formData'].includes(config.responseType)) {
                    data = yield new Response(stream)[config.responseType]();
                  } else {
                    data = yield new Response(stream).text();

                    try {
                      data = JSON.parse(data);
                    } catch (e) {}
                  }
                } catch (e) {
                  return makeError(reject, new Error('Response parse error'), config);
                }

                resolve({
                  data,
                  response
                });
              });

              function start(_x3) {
                return _ref2.apply(this, arguments);
              }

              return start;
            })()
          });
        } catch (e) {
          // user aborted will in, timeout will in but the promise is already be rejected
          makeError(reject, e, config);
        }
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    })());
  }

  function handleTimeout(controller, reject, config) {
    controller.abort();
    makeError(reject, new Error(`Timeout of ${config.timeout}ms exceeded`), config);
  }

  function handler(urlOrConfig, config = {}) {
    let url;

    if (typeof urlOrConfig === 'string') {
      url = urlOrConfig;
    } else {
      config = urlOrConfig;
      url = config.url;
    }

    Object.keys(this.config).forEach(k => k in config ? 0 : config[k] = deepClone(this.config[k]));
    config.url = url;
    return interceptor(this.interceptors.request.handlers, request, this.interceptors.response.handlers, config);
  }

  const Fetch = function Fetch(urlOrConfig, config) {
    return handler.call(Fetch, urlOrConfig, config);
  };

  Fetch.config = {};
  Fetch.interceptors = {
    request: {
      use(onFulfilled, onRejected) {
        return this.handlers.push(onFulfilled, onRejected);
      },

      handlers: []
    },
    response: {
      use(onFulfilled, onRejected) {
        return this.handlers.push(onFulfilled, onRejected);
      },

      handlers: []
    }
  };

  Fetch.create = function (config = {}) {
    const fetchInstance = function fetchInstance(urlOrConfig, config) {
      return handler.call(fetchInstance, urlOrConfig, config);
    };

    Object.keys(this).forEach(k => {
      if (k === 'create') return;
      const v = this[k];
      fetchInstance[k] = v;
    });
    Object.keys(this.config).forEach(k => k in config ? 0 : config[k] = deepClone(this.config[k]));
    fetchInstance.config = config;
    return fetchInstance;
  };

  ['post', 'put', 'patch'].forEach(method => {
    Fetch[method] = function (url, data, config = {}) {
      config.method = method;
      config.data = data;
      return handler.call(this, url, config);
    };
  });
  ['get', 'delete', 'options', 'head'].forEach(method => {
    Fetch[method] = function (url, params, config = {}) {
      config.method = method;
      config.params = params;
      return handler.call(this, url, config);
    };
  });
  return Fetch;
});

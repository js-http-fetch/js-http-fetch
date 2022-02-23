export const isProduction = process.env.NODE_ENV === 'production'

export function deepClone<T>(o: T): T {
  if (typeof o !== 'object') return o
  if (Array.isArray(o)) return o.map(deepClone) as any as T
  const res = {} as T
  Object.keys(o).forEach(k => res[k] = deepClone(o[k]))
  return res
}

export function urlSerialize(url: string, params: unknown) {
  let s = paramsSerialize(params)
  s = s[0] === '&' ? s.slice(1) : s
  return url + (s ? (url.lastIndexOf('?') > -1 ? '&' : '?') + s : '')
}

function paramsSerialize(params: unknown, s = ''): string {
  return typeof params === 'object' ?
    (params != null ?
        Object.keys(params).reduce((p, c) => p + (params[c] != null ? '&' + c + '=' + paramsSerialize(params[c]) : ''), s)
        : s
    )
    : s + params
}

export function type(o: unknown): string {
  return Object.prototype.toString.call(o).slice(8, -1)
}

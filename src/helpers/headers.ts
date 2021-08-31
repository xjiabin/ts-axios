import { isPlainObject } from './util'

// 规范化 headers 的 key
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) return

  Object.keys(headers).forEach((name) => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  // data 为普通对象时添加 application/json 的 header
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): any {
  if (!headers) return ''

  let parsed = Object.create(null)
  headers.split('\r\n').forEach((line) => {
    let [key, val] = line.split(':')

    key = key.trim().toLowerCase()
    if (!key) return

    if (val) val = val.trim()

    parsed[key] = val
  })

  return parsed
}

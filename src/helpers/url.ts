import { isDate, isPlainObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 构建 url，将 params 拼接到 url 后面
 * @param url url
 * @param params params
 * @returns new url
 * @example 参数值为对象 buildUrl('/base/get', { a: 1, b: 2 }) => /base/get?a=1&b=2  把 params 对象的 key 和 value 拼接到 url 上
 * @example 参数值为数组 buildUrl('/base/get', { foo: ['bar', 'baz'] }) => /base/get?foo[]=bar&foo[]=baz  把 foo 数组的元素展开拼接到 url 上
 * @example 参数值为对象 buildUrl('/base/get', { foo: { bar: 'baz' } }) => /base/get?foo=%7B%22bar%22:%22baz%22%7D  foo 后面拼接的是 {"bar":"baz"} encode 后的结果
 * @example 参数值为 Date 类型 buildUrl('/base/get', { date: new Date() }) => /base/get?date=2019-04-01T05:55:39.030Z  date 后面拼接的是 date.toISOString() 的结果
 */
export function buildUrl(url: string, params?: any): string {
  if (!params) return url

  const parts: string[] = []
  Object.keys(params).forEach((key) => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') return

    // 将 value 统一转换成数组形式
    let values = []
    if (Array.isArray(val)) {
      // 如果是数组，key 要拼接上 []
      values = val
      key += '[]'
    } else {
      // 如果不是数组则转化为数组形式
      values = [val]
    }

    values.forEach((val) => {
      if (isDate(val)) {
        // 参数值为日期类型
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        // 参数值为对象类型
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    // 去除 # 后面的内容
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // url 中是否已经带有参数
    const hasOriginParams = url.indexOf('?') > -1
    url += (hasOriginParams ? /* 已经带了参数 */ '&' : /* 没有带参数 */ '?') + serializedParams
  }

  return url
}

import { transformRequest } from './helpers/data'
import { buildUrl } from './helpers/url'
import { AxiosRequestConfig } from './types'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  config.data = transformRequestData(config)

  xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  // 处理 url
  config.url = transformURL(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

export default axios

import { UAParser } from 'ua-parser-js'

export interface UserAgentInfo {
  browser: string | undefined
  browserVersion: string | undefined
  deviceModel: string | undefined
  deviceType: string | undefined
  deviceVendor: string | undefined
  os: string | undefined
  osVersion: string | undefined
}

export default function getUserAgent(): UserAgentInfo {
  const parser = new UAParser()
  const result = parser.getResult()

  return {
    browser: result.browser.name,
    browserVersion: result.browser.version,
    deviceModel: result.device.model,
    deviceType: result.device.type,
    deviceVendor: result.device.vendor,
    os: result.os.name,
    osVersion: result.os.version,
  }
}

import { CookieSetOptions } from 'universal-cookie'
import { serialize, parse } from 'cookie'

export function setCookie (key: string, value: string, options: CookieSetOptions = {}) {
  if (!process.browser) return
  const cookie = serialize(key, value, options)
  document.cookie = cookie
}

export function getCookie (key: string) {
  if (!process.browser) return
  const cookies = document?.cookie.split(';')
  const foundCookie = cookies.find((cookie) => cookie.trim().startsWith(`${key}=`))
  if (!foundCookie) return null
  const parsedCookie = parse(foundCookie)
  return parsedCookie[key]
}

export function removeCookie (key: string) {
  if (!process.browser) return
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

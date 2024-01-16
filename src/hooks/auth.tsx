import { setCookie, removeCookie } from '@/helpers/cookie'

export const USER_TOKEN = "user_token"
export async function signIn() {
  const user = await fetch("api/auth").then((res) => res.json())
  setCookie(USER_TOKEN, JSON.stringify(user))
  return user
}

export async function signOut() {
  removeCookie(USER_TOKEN)
  Promise.resolve(true)
}

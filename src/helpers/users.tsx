import { User } from '../types/user'

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('https://theofficeapi.dev/api/characters?limit=100')
  const data = await res.json()
  return data.results
}

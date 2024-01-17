'use client'
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { signIn, signOut, USER_TOKEN } from "@/helpers/auth";
import { getCookie } from "@/helpers/cookie";
import Section from "@/components/Section";
import { fetchUsers } from "@/helpers/users";

const defaultUser: User = {
  id: null,
  name: "",
  gender: '',
  marital: '',
  firstAppearance: '',
  lastAppearance: '',
  actor: '',
  job: [],
  workplace: [],
};

export default function Home() {
  const [user, setUser] = useState<User>(defaultUser);
  const token = getCookie(USER_TOKEN);
  const [coworkers, setCoworkers] = useState<User[]>([]);
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  const authenticate = () => {
    signIn().then(setUser);
  }

  useEffect(() => {
    if (token) {
      if (user.id === null) {
        authenticate();
      }
      fetchUsers().then(setCoworkers);
    }
  }, [token]);

  if (!isClient) return null

  return (
    <main>
      <header className="flex justify-between h-50 p-2">
        <div className="flex justify-between w-1/3 p-6 bg-white border border-gray-200 rounded-md shadow dark:border-gray-700">
          <div>
            <h1>{token ? `Welcome, ${user.name}` : 'Welcome, please sign in.'}</h1>
            {user.workplace.length ? <p>Company: {user.workplace[0]}</p> : null}
            {user.job.length ? <p>Position: {user.job[0]}</p> : null}
          </div>
        </div>
        {token ? (
          <button className="h-10 pr-4 pl-4 rounded-md bg-red-500"  onClick={() => signOut().then(() => setUser(defaultUser))}>Sign Out</button>
        ) : (
          <button className="h-10 pr-4 pl-4 rounded-md bg-green-500" onClick={authenticate}>Sign In</button>
        )}
      </header>
      {token && (
        <section className="p-2">
          <h2 className="text-xl font-bold">Coworkers</h2>
          <ul>
            {coworkers.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

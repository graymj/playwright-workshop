'use client'
import { useEffect, useState } from "react";
import { User } from "../pages/api/auth";
import { signIn, signOut, USER_TOKEN } from "@/hooks/auth";
import { getCookie } from "@/helpers/cookie";
import { Bear } from "../pages/api/bears";
import { Beet } from "../pages/api/beets";
import { BSGCharacters } from "../pages/api/bsg";
import Section from "@/components/Section";

const defaultUser: User = {
  id: null,
  fullName: "",
  email: "",
  profile: "",
};

export default function Home() {
  const [user, setUser] = useState<User>(defaultUser);
  const token = getCookie(USER_TOKEN);

  const [bears, setBears] = useState<Bear[]>([]);
  const [beets, setBeets] = useState<Beet[]>([]);
  const [bsg, setBSG] = useState<BSGCharacters[]>([]);
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  const authenticate = () => {
    signIn().then(({ data }) => setUser(data));
  }
  const fetchBears = () => {
    fetch("api/bears").then((res) => res.json()).then(({ bears }) => setBears(bears));
  }

  const fetchBeets = () => {
    fetch("api/beets").then((res) => res.json()).then(({ beets }) => setBeets(beets));
  }

  const fetchBSG = () => {
    fetch("api/bsg").then((res) => res.json()).then(({ data }) => setBSG(data));
  }

  useEffect(() => {
    if (token) {
      if (user.id === null) {
        authenticate();
      }
      fetchBears();
      fetchBeets();
      fetchBSG();
    }
  }, [token]);

  if (!isClient) return null

  return (
    <main>
      <header className="flex justify-between h-50 p-2">
        <div className="flex justify-between w-1/3 p-6 bg-white border border-gray-200 rounded-md shadow dark:border-gray-700">
          <div>
            <h1>{token ? `Welcome, ${user.fullName}` : 'Welcome, please sign in.'}</h1>
            {user.email ? <p>email: {user.email}</p> : null}
          </div>
          {user.profile?.length ? <img className='h-40' src={user.profile} alt={user.fullName} /> : null}
        </div>
        {token ? (
          <button className="h-10 pr-4 pl-4 rounded-md bg-red-500"  onClick={() => signOut().then(() => setUser(defaultUser))}>Sign Out</button>
        ) : (
          <button className="h-10 pr-4 pl-4 rounded-md bg-green-500" onClick={authenticate}>Sign In</button>
        )}
      </header>
      {token && (
        <section className="p-2">
          <h2 className="text-xl font-bold">Favorite Things</h2>
          <Section name="Bears" data={bears} />
          <Section name="Beets" data={beets} />
          <Section name="BSG Characters" data={bsg} />
        </section>
      )}
    </main>
  )
}
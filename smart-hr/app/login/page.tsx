"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const handleLogin = async (e:any) => {
    e.preventDefault()

    await signIn("credentials",{
      email,
      password,
      callbackUrl:"/dashboard"
    })
  }

  return (

    <div className="flex h-screen items-center justify-center bg-gray-100">

      <form
      onSubmit={handleLogin}
      className="bg-white p-8 rounded-lg shadow w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          HR Management Login
        </h1>

        <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-4"
        onChange={(e)=>setEmail(e.target.value)}
        />

        <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-4"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button
        className="w-full bg-blue-600 text-white p-2 rounded">

          Login

        </button>

      </form>

    </div>
  )
}
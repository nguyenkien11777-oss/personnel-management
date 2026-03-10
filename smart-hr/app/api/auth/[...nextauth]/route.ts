import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {

        if (
          credentials?.email === "admin@test.com" &&
          credentials?.password === "123456"
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@test.com",
            role: "admin"
          }
        }

        return null
      },
    }),
  ],

  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      session.user.role = token.role
      return session
    }

  }

})

export { handler as GET, handler as POST }
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

async authorize(credentials) {
        try {
          const { email, password } = credentials as { email: string; password: string }
          
          const user = await import('@/services/nguoi_dung_service').then(m => m.kiemTraDangNhap(email, password))
          
          if (user) {
            return {
              id: (user._id as any).toString(),
              name: user.ten,
              email: user.email,
              role: user.vaiTro,
              nhanVienId: user.nhanVienId?.toString()
            }
          }
          
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
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
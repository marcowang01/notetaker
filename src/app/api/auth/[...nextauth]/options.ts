import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email === process.env.GOOGLE_EMAIL
      }
      return false
    },
    async redirect({ url, baseUrl }) {
      // for now, always redirect to "/"
      // for some reason, url always points to "/client"

      return baseUrl

      // // Allows relative callback URLs
      // if (url.startsWith("/")) return `${baseUrl}${url}`
      // // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) return url
      // return baseUrl
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
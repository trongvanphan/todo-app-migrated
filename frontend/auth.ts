import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "anonymous",
      credentials: {},
      async authorize() {
        try {
          const res = await fetch(`${INTERNAL_API_URL}/auth/anonymous`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: String(data.user_id),
            name: "Guest",
            anonymousToken: data.access_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days — matches FastAPI JWT expiry
  },
  callbacks: {
    async jwt({ token, account, user, trigger }) {
      if (trigger === "signIn" && account) {
        if (account.type === "credentials") {
          // Anonymous sign-in: token was set in authorize() and passed via user object
          token.accessToken = (user as any).anonymousToken;
        } else {
          // OAuth sign-in: exchange provider identity for FastAPI JWT
          try {
            const res = await fetch(`${INTERNAL_API_URL}/auth/oauth`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                provider: account.provider,
                provider_id: account.providerAccountId,
                email: token.email,
                name: token.name,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              token.accessToken = data.access_token;
              token.fastapiUserId = data.user_id;
            }
          } catch {
            // Token exchange failed — session will have no accessToken
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});

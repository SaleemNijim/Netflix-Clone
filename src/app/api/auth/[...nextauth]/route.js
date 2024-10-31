import NextAuth from "next-auth/next";
import GithubProvider from 'next-auth/providers/github'


const authOptions = {
    providers: [
        GithubProvider({
            clientId: "Iv1.e15d83051fed2928",
            clientSecret: "afdf242c5a2494ea8461c908188a95e5765efddf",
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
            session.user.username = session?.user?.name
                .split(" ")
                .join("")
                .toLocaleLowerCase();

            session.user.uid = token.sub

            return session
        }
    },
    secret: 'default_secret_key'
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
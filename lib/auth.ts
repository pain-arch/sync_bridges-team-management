import { PrismaAdapter } from '@auth/prisma-adapter'
import { getServerSession, NextAuthOptions } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'


export const authOptions: NextAuthOptions = {
    session: {
        "strategy": "jwt",
    },
    pages: {
        error: "/sign-in",
        signIn: "/sign-in",
    },
    adapter: PrismaAdapter(db) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.Apple_CLIENT_ID!,
            clientSecret: process.env.Apple_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" , placeholder: "Username" },
                email: { label: "Email", type: "email" , placeholder: "Email" },
                password: { label: "Password", type: "password" , placeholder: "Password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password");
                }

                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    }
                })

                if (!user || !user?.hasedPassword) {
                    throw new Error("No user found, please enter valid email and password");
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.hasedPassword);

                if (!passwordMatch) {
                throw new Error("The password you entered is incorrect, please enter a valid password");
                }

                return user;
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token}) {
            
            if (token){
                session.user.id = token.id;
                session.user.name = token.name;
                session.user?.email = token.email;
                session.user?.image = token.picture;
                session.user.username = token.username;

            }

            const user = await db.user.findUnique({
                where: {
                    id: token.id,

                },
            });

            if (user) {
                session.user?.image = user.image;
                session.user?.name = user.name.toLowerCase();
            }

            return session;
        },
        async jwt({token, user}){
            
            const dbUser = await db.user.findFirst({
                where: {
                    email: token?.email,
                    
                },
            });

            if (!dbUser) {
                token.id = user?.id;
                return token;
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            }
        },
    },
};

export const getAuthsession = () => getServerSession(authOptions);
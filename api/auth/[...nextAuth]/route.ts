import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";


const handlar = NextAuth(authOptions);

export { handlar  as GET, handlar as POST };
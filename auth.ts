import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";

export const { auth } = NextAuth(authOptions); 
"use server";

import { signIn, signOut } from "@/auth";

export async function handleGoogleSignIn() {
  await signIn("google", { redirectTo: "/home" });
}

export async function handleGoogleSignOut() {
  await signOut({ redirect: true, redirectTo: "/" });
}

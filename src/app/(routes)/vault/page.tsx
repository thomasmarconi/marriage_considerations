"use client";
import SignIn from "@/components/auth/sign-in";
import Vault from "@/components/page_ui/vault";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  if (!session) {
    return <SignIn />;
  }
  return <Vault />;
}

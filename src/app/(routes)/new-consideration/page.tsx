"use client";
import SignIn from "@/components/auth/sign-in";
import NewConsideration from "@/components/page_ui/new-consideration";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  if (!session) {
    return <SignIn />;
  }
  return <NewConsideration />;
}

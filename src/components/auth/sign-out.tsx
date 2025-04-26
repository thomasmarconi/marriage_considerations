"use client";

import { handleGoogleSignOut } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";

export default function SignOut() {
  return (
    <form action={handleGoogleSignOut}>
      <Button variant="outline" type="submit">
        Sign Out with Google
      </Button>
    </form>
  );
}

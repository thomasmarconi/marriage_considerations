"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SignIn from "@/components/auth/sign-in";
import { Button } from "@/components/ui/button";
import { HeartIcon, Lock, LogOut } from "lucide-react";
import Image from "next/image";
import { handleGoogleSignOut } from "@/actions/auth-actions";

export default function Page() {
  const { data: session } = useSession();

  if (!session) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Marriage Considerations
          </h1>
          <div className="flex items-center gap-3">
            <Image
              src={session.user?.image || "/default-avatar.png"}
              width={40}
              height={40}
              alt="Profile"
              className="rounded-full border-2 border-violet-300"
            />
            <span className="font-medium text-slate-700">
              {session.user?.name}
            </span>
          </div>
        </header>

        <main className="grid gap-8 md:grid-cols-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-pink-100 group">
            <Button
              className="w-full h-32 flex flex-col gap-3 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white"
              type="button"
            >
              <Link
                href="/new-consideration"
                className="flex flex-col items-center w-full"
              >
                <HeartIcon
                  size={40}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-xl">New Consideration</span>
              </Link>
            </Button>
            <p className="mt-4 text-slate-600 text-center">
              Create a new entry for your marriage considerations
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-indigo-100 group">
            <Button
              className="w-full h-32 flex flex-col gap-3 bg-gradient-to-r from-indigo-400 to-violet-400 hover:from-indigo-500 hover:to-violet-500 text-white"
              type="button"
            >
              <Link href="/vault" className="flex flex-col items-center w-full">
                <Lock
                  size={40}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-xl">View Vault</span>
              </Link>
            </Button>
            <p className="mt-4 text-slate-600 text-center">
              Access your saved marriage considerations
            </p>
          </div>
        </main>

        <div className="mt-8 flex justify-center">
          <form
            action={async () => {
              await handleGoogleSignOut();
            }}
          >
            <Button
              variant="outline"
              type="submit"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 border-slate-300 hover:bg-slate-100"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </form>
        </div>

        <footer className="mt-16 text-center text-sm text-slate-500">
          <p>Your private space for meaningful reflections on marriage</p>
        </footer>
      </div>
    </div>
  );
}

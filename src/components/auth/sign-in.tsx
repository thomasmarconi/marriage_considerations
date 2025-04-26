"use client";

import { handleGoogleSignIn } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-pink-400 to-violet-400 flex items-center justify-center mb-4">
            <HeartIcon size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-center">
            Marriage Considerations
          </h1>
          <p className="mt-2 text-slate-600 text-center">
            Your private space for meaningful reflections on marriage
          </p>
        </div>

        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-slate-800">Welcome</h2>
            <p className="text-slate-600">
              This personal tool helps you document, reflect upon, and organize
              thoughts about marriage in a structured, private environment.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-slate-700">Features:</h3>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>✓ Create thoughtful consideration entries</li>
              <li>✓ Securely store your personal reflections</li>
              <li>✓ Review and revisit insights over time</li>
              <li>✓ Private access - only you can see your content</li>
            </ul>
          </div>

          <div className="pt-2">
            <form action={handleGoogleSignIn}>
              <Button
                variant="default"
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white py-6"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </div>
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Your data is kept private and secure.</p>
        </div>
      </div>
    </div>
  );
}

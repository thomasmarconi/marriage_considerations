"use client";
import SignIn from "@/components/auth/sign-in";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
export default function Page() {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   // Redirect to home page if already authenticated
  //   if (status === "authenticated") {
  //     router.push("/home");
  //   }
  // }, [status, router]);

  // Only show the sign in page if not authenticated
  // if (status === "unauthenticated") {
  return <SignIn />;
  // }

  // Show loading state while checking authentication
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 flex items-center justify-center">
  //     <div className="animate-pulse text-slate-500">Loading...</div>
  //   </div>
  // );
}

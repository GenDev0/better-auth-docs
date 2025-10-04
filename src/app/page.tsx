"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-6 h-screen opacity-50">
        <Spinner className="size-8 text-blue-400" />
      </div>
    );
  }

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session === null ? (
          <>
            <h1 className="text-3xl font-bold">Hello, there 👋</h1>
            <Button asChild size={"lg"}>
              <Link href={"/auth/login"}>Sign In / Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Welcome, {session?.user.name} ! 👋
            </h1>
            <Button
              size={"lg"}
              variant={"destructive"}
              onClick={() => authClient.signOut()}
            >
              Logout
              <LogOut />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

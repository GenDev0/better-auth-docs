"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { SignInTab } from "./_components/sign-in-tab";
import { SignUpTab } from "./_components/sign-up-tab";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "./_components/social-auth-buttons";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { EmailVerification } from "./_components/email-verification";
import { ForgotPassword } from "./_components/forgot-password";

export type Tab =
  | "signin"
  | "signup"
  | "email-verification"
  | "forgot-password";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) {
        router.push("/");
      }
    });
  }, [router]);

  function openEmailVerificationTab(email: string) {
    setEmail(email);
    setSelectedTab("email-verification");
  }

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(t) => {
        setSelectedTab(t as Tab);
      }}
      className="mx-auto w-full my-6 px-4"
    >
      {(selectedTab === "signin" || selectedTab === "signup") && (
        <TabsList>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle className="">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Sign in Form */}
            <SignInTab
              openEmailVerificationTab={openEmailVerificationTab}
              openForgotPasswordTab={() => setSelectedTab("forgot-password")}
            />
          </CardContent>
          <Separator />
          <CardFooter className="grid grid-cols-2 gap-2">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle className="">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Sign up Form */}
            <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="email-verification">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle className="">Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={email} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="forgot-password">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle className="">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPassword openSignInTab={() => setSelectedTab("signin")} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

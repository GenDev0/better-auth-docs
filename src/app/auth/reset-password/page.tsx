"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "Password and confirm password do not match.",
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchparams = useSearchParams();
  const token = searchparams.get("token");
  const error = searchparams.get("error");

  const [isHidden, setIsHidden] = useState(true);

  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleResetPassword = async ({ password }: ResetPasswordForm) => {
    if (token == null) return;
    authClient.resetPassword(
      {
        newPassword: password,
        token,
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send password reset email."
          );
        },
        onSuccess: () => {
          toast.success("Password reset successful", {
            description: "Redirection to login...",
          });
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        },
      }
    );
  };

  if (token == null || error != null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-2xl font-bold">
          <CardTitle className="">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name={"password"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputGroupInput
                        type={isHidden ? "password" : "text"}
                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        <FormControl>
                          <InputGroupButton
                            aria-label="Copy"
                            title="Copy"
                            size="icon-xs"
                            onClick={() => {
                              setIsHidden((prevState) => !prevState);
                            }}
                          >
                            {isHidden ? <EyeClosed /> : <Eye />}
                          </InputGroupButton>
                        </FormControl>
                      </InputGroupAddon>
                    </InputGroup>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"confirmPassword"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <InputGroupInput
                        type={isHidden ? "password" : "text"}
                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        <FormControl>
                          <InputGroupButton
                            aria-label="Eye"
                            title="Eye"
                            size="icon-xs"
                            onClick={() => {
                              setIsHidden((prevState) => !prevState);
                            }}
                          >
                            {isHidden ? <EyeClosed /> : <Eye />}
                          </InputGroupButton>
                        </FormControl>
                      </InputGroupAddon>
                    </InputGroup>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <LoadingSwap isLoading={isSubmitting}>
                  Reset password
                </LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

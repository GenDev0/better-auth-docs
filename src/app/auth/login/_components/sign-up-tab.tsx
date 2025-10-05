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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(8),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const [isHidden, setIsHidden] = useState(true);
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSignUp = async ({ email, name, password }: SignUpForm) => {
    const res = await authClient.signUp.email(
      {
        email,
        name,
        password,
        callbackURL: "/",
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign up");
        },
      }
    );
    if (res.error == null && !res.data.user.emailVerified) {
      openEmailVerificationTab(email);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"password"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              {/* <Input type="password" {...field} /> */}
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
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Spinner />}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}

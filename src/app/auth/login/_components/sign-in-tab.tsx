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
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInTab() {
  const [isHidden, setIsHidden] = useState(true);
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSignIn = async ({ email, password }: SignInForm) => {
    authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign in");
        },
        onSuccess: () => {
          toast.success("You have signed In successfully!");
          router.push("/");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
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
          Sign In
        </Button>
      </form>
    </Form>
  );
}

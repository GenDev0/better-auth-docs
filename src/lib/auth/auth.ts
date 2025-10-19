import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sendResetPasswordEmail } from "../email/send-reset-password-email";
import { sendVerificationEmail } from "../email/send-verification-email";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../email/welcome-email";
import { sendDeleteAccountVerificationEmail } from "../email/delete-account-verification";

export const auth = betterAuth({
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true,
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ user, url });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({
        favoriteNumber: Number(profile.public_repos) || 0,
      }),
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({
        favoriteNumber: Number(profile.public_flags) || 0,
      }),
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minutes
    },
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const session = ctx.context.newSession;
        const user =
          session != null
            ? session.user
            : { name: ctx.body.name, email: ctx.body.email };

        await sendWelcomeEmail(user);
      }
    }),
  },
});

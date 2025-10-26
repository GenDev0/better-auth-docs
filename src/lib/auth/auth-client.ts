import { ac, admin, user } from "@/components/auth/permissions";
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  passkeyClient,
  twoFactorClient,
  adminClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa";
      },
    }),
    passkeyClient(),
    adminClient({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});

import { DiscordIcon, GitHubIcon } from "@/components/auth/o-auth-icons";
import { ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "discord"];

export type SupportedOauthProviders =
  (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOauthProviders,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  discord: {
    name: "Discord",
    Icon: DiscordIcon,
  },
  github: {
    name: "Github",
    Icon: GitHubIcon,
  },
};

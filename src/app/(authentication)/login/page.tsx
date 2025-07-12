import { Metadata } from "next";
import { LoginPageClient } from "./LoginPageClient";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}

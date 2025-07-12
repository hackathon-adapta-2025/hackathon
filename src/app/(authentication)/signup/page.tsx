import { Metadata } from "next";
import { SignupPageClient } from "./SignupPageClient";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupPage() {
  return <SignupPageClient />;
}

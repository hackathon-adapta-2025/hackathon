import { Metadata } from "next";
import { ForgotPasswordPageClient } from "./ForgotPasswordPageClient";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}

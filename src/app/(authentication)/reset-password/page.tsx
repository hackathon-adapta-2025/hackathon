import { Metadata } from "next";
import { ResetPasswordPageClient } from "./ResetPasswordPageClient";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}

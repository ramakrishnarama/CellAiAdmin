import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CELLAI",
  description: "CELLAI",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}

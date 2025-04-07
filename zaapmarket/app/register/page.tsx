import RegisterForm from "@/components/auth/RegisterForm";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <RegisterForm />
    </div>
  );
}
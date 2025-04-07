import LoginForm from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
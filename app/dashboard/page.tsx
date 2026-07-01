import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmailGenerator } from "@/components/email-generator";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Generate a professional email in seconds.
          </p>
        </div>

        <EmailGenerator />
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { GlassLayout } from "@/components/ui/glass-layout";
import { WalletDashboard } from "@/components/wallet/dashboard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40">Securing Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <GlassLayout>
      <WalletDashboard />
    </GlassLayout>
  );
}

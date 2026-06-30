"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out MailCraft AI.",
    badge: null,
    features: [
      "10 email generations / month",
      "All 4 tone options",
      "Short & medium length",
      "Copy to clipboard",
      "Basic support",
    ],
    cta: "Get started",
    href: "/signup",
    variant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For professionals who write emails every day.",
    badge: "Most popular",
    features: [
      "Unlimited email generations",
      "All 4 tone options",
      "All length options",
      "Copy to clipboard",
      "Email history (last 50)",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
    href: null,
    variant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and businesses with high-volume needs.",
    badge: null,
    features: [
      "Everything in Pro",
      "Team workspace",
      "Custom tone presets",
      "API access",
      "Dedicated account manager",
      "SLA guarantee",
      "SSO / SAML",
    ],
    cta: "Contact sales",
    href: "mailto:sales@mailcraft.ai",
    variant: "outline" as const,
  },
];

export default function PricingPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  function handleUpgrade(planName: string) {
    setSelectedPlan(planName);
    setUpgradeOpen(true);
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm">
            Simple pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Plans for every need
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.badge
                  ? "border-primary shadow-lg ring-1 ring-primary/20"
                  : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-1 text-xs font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-8">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-2">/ {plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {plan.href ? (
                  <Button
                    variant={plan.variant}
                    className="w-full"
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                ) : (
                  <Button
                    variant={plan.variant}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Guarantee strip */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          All paid plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>

      {/* Upgrade dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedPlan}</DialogTitle>
            <DialogDescription>
              Payment integration coming soon! We&apos;re working on connecting
              Stripe to make upgrades seamless. You&apos;ll be the first to know
              when it&apos;s ready.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 text-sm space-y-2">
            <p className="font-medium">What&apos;s coming:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Secure checkout via Stripe</li>
              <li>• Instant plan activation</li>
              <li>• Cancel anytime from your profile</li>
            </ul>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={() => setUpgradeOpen(false)}>
              Got it
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setUpgradeOpen(false)}
              asChild
            >
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

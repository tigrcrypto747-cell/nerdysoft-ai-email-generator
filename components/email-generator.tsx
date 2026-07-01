"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EmailTone, EmailLength } from "@/lib/email-generator";
import { Loader2, Copy, CheckCheck, Sparkles, RefreshCw } from "lucide-react";

interface GeneratedEmail {
  subject: string;
  body: string;
}

export function EmailGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<EmailTone>("formal");
  const [length, setLength] = useState<EmailLength>("medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedEmail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"subject" | "body" | "all" | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), tone, length }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Generation failed. Please try again.");
      }

      const data: GeneratedEmail = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(text: string, type: "subject" | "body" | "all") {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  const fullEmail = result
    ? `Subject: ${result.subject}\n\n${result.body}`
    : "";

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Email Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Email topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Follow up on our product demo from last Tuesday"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Describe what this email is about in a sentence or two.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={tone}
                onValueChange={(v) => setTone(v as EmailTone)}
                disabled={loading}
              >
                <SelectTrigger id="tone" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select
                value={length}
                onValueChange={(v) => setLength(v as EmailLength)}
                disabled={loading}
              >
                <SelectTrigger id="length" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={!topic.trim() || loading}
            className="w-full h-11 text-base font-medium transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : result ? (
              <>
                <RefreshCw className="mr-2 w-4 h-4" />
                Regenerate
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-4 h-4" />
                Generate email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Card — fades and slides up when the result arrives */}
      {result && (
        <Card className="animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated email</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(fullEmail, "all")}
                className="gap-1.5"
              >
                {copied === "all" ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy all
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Subject
                </Label>
                <button
                  onClick={() => copyToClipboard(result.subject, "subject")}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  {copied === "subject" ? (
                    <><CheckCheck className="w-3 h-3" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm font-medium">
                {result.subject}
              </div>
            </div>

            <Separator />

            {/* Body */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Body
                </Label>
                <button
                  onClick={() => copyToClipboard(result.body, "body")}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  {copied === "body" ? (
                    <><CheckCheck className="w-3 h-3" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
              </div>
              <Textarea
                readOnly
                value={result.body}
                className="min-h-[260px] resize-y font-mono text-sm leading-relaxed bg-muted/30"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

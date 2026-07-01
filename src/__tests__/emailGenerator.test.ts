import { emailGeneratorService } from "@/lib/email-generator";
import type { EmailTone, EmailLength } from "@/lib/email-generator";

// Use fake timers so the ~1s artificial delay resolves instantly
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

async function generate(
  topic: string,
  tone: EmailTone = "formal",
  length: EmailLength = "short"
) {
  const promise = emailGeneratorService.generate({ topic, tone, length });
  await jest.runAllTimersAsync();
  return promise;
}

describe("emailGeneratorService.generate()", () => {
  it("returns an object with subject and body string fields", async () => {
    const result = await generate("project update");

    expect(result).toHaveProperty("subject");
    expect(result).toHaveProperty("body");
    expect(typeof result.subject).toBe("string");
    expect(typeof result.body).toBe("string");
  });

  it("returns non-empty subject and body", async () => {
    const result = await generate("quarterly review");

    expect(result.subject.length).toBeGreaterThan(0);
    expect(result.body.length).toBeGreaterThan(0);
  });

  it("includes the topic text in the email body", async () => {
    const topic = "annual performance review";
    const result = await generate(topic, "formal", "medium");

    expect(result.body).toContain(topic);
  });

  it("formal tone produces a greeting of 'Dear Sir/Madam,'", async () => {
    const result = await generate("contract renewal", "formal", "short");

    expect(result.body).toContain("Dear Sir/Madam,");
  });

  it("casual tone produces a greeting of 'Hey,'", async () => {
    const result = await generate("team lunch", "casual", "short");

    expect(result.body).toContain("Hey,");
  });

  it("long length produces more body content than short length", async () => {
    const shortPromise = emailGeneratorService.generate({
      topic: "project update",
      tone: "friendly",
      length: "short",
    });
    await jest.runAllTimersAsync();
    const short = await shortPromise;

    const longPromise = emailGeneratorService.generate({
      topic: "project update",
      tone: "friendly",
      length: "long",
    });
    await jest.runAllTimersAsync();
    const long = await longPromise;

    expect(long.body.length).toBeGreaterThan(short.body.length);
  });

  it("subject reflects the topic for persuasive tone", async () => {
    const result = await generate("new product launch", "persuasive", "short");

    // Persuasive subjects always contain the topic
    expect(result.subject.toLowerCase()).toContain("new product launch");
  });
});

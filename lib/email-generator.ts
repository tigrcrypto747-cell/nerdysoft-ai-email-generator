export type EmailTone = "formal" | "friendly" | "persuasive" | "casual";
export type EmailLength = "short" | "medium" | "long";

export interface EmailGenerationParams {
  topic: string;
  tone: EmailTone;
  length: EmailLength;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

// Service interface — swap this implementation for a real AI provider later
export interface EmailGeneratorService {
  generate(params: EmailGenerationParams): Promise<GeneratedEmail>;
}

const TONE_OPENERS: Record<EmailTone, string[]> = {
  formal: [
    "I am writing to",
    "I would like to bring to your attention",
    "Please allow me to",
    "I am reaching out regarding",
  ],
  friendly: [
    "Hey! I wanted to reach out about",
    "Hope you're doing great! I'm writing about",
    "Just wanted to touch base about",
    "Hi there! Quick note about",
  ],
  persuasive: [
    "I have an exciting opportunity regarding",
    "I believe this is the perfect moment to discuss",
    "You won't want to miss what I have to share about",
    "Here's why you should pay attention to",
  ],
  casual: [
    "So I was thinking about",
    "Quick thing about",
    "Wanted to chat about",
    "Heads up about",
  ],
};

const TONE_CLOSERS: Record<EmailTone, string[]> = {
  formal: [
    "I look forward to your prompt response.\n\nYours sincerely,",
    "Thank you for your time and consideration.\n\nBest regards,",
    "Please do not hesitate to contact me should you require further information.\n\nKind regards,",
  ],
  friendly: [
    "Can't wait to hear back from you!\n\nCheers,",
    "Let me know what you think!\n\nBest,",
    "Talk soon!\n\nTake care,",
  ],
  persuasive: [
    "Don't miss this opportunity — let's connect soon.\n\nBest regards,",
    "I'm confident this will exceed your expectations. Let's move forward.\n\nWarm regards,",
    "The next step is yours — I look forward to hearing from you.\n\nSincerely,",
  ],
  casual: [
    "Catch you later!\n\nCheers,",
    "Let me know!\n\nThanks,",
    "Talk soon!\n\n",
  ],
};

const LENGTH_PARAGRAPHS: Record<EmailLength, number> = {
  short: 1,
  medium: 2,
  long: 3,
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildParagraph(topic: string, tone: EmailTone, index: number): string {
  const paragraphs: Record<EmailTone, string[][]> = {
    formal: [
      [
        `${topic} represents a matter of considerable importance that warrants careful examination. I have taken the liberty of preparing a comprehensive overview that outlines the key aspects of this subject.`,
        `Following a thorough analysis of ${topic}, I have identified several critical factors that may influence the outcome. These findings have been documented and are available for your review.`,
      ],
      [
        `Upon further reflection on ${topic}, it becomes evident that a structured approach is essential. I propose that we establish a clear timeline and assign responsibilities accordingly to ensure optimal results.`,
        `The implications of ${topic} extend beyond the immediate context and may have lasting consequences. It is therefore imperative that we address this matter with the diligence it deserves.`,
      ],
      [
        `In conclusion, the matter of ${topic} requires decisive action and collaborative effort. I remain confident that, with the appropriate measures in place, we can achieve a satisfactory resolution.`,
        `I trust that this correspondence provides sufficient clarity regarding ${topic}. Should any additional information be required, please do not hesitate to request it.`,
      ],
    ],
    friendly: [
      [
        `So, ${topic} has been on my mind lately, and I thought it'd be great to loop you in! There's a lot of exciting stuff happening and I really think you'd love to be part of it.`,
        `I've been doing some research on ${topic} and honestly, it's been super interesting! There are so many cool angles to explore and I think we could do something awesome with it.`,
      ],
      [
        `What I really love about ${topic} is how versatile it is — there are so many ways we could approach it together. I have some ideas I'd love to bounce off you when you get a chance!`,
        `${topic} has actually sparked a few ideas for me that I think could be really fun to explore. I'd love to grab a virtual coffee and chat more about the possibilities.`,
      ],
      [
        `Anyway, I think ${topic} could be a real game changer for us if we play our cards right. Let me know if you're as excited about this as I am!`,
        `I'm genuinely pumped about where ${topic} could take us! I think with the right approach, we're going to see some really cool results.`,
      ],
    ],
    persuasive: [
      [
        `${topic} is not merely a trend — it is a transformational opportunity that forward-thinking individuals are already leveraging to gain a competitive edge. The data speaks clearly: early adopters are seeing remarkable results.`,
        `Consider the proven impact of ${topic}: organizations that have embraced this approach consistently outperform their peers. The evidence is compelling, and the window of opportunity is now.`,
      ],
      [
        `The financial and strategic implications of ${topic} cannot be overstated. By acting now, you position yourself ahead of the curve and avoid the costs of delayed adoption.`,
        `Every day without action on ${topic} is an opportunity missed. The most successful players in this space move decisively — and the results they achieve validate every bold decision.`,
      ],
      [
        `Imagine the possibilities once ${topic} is fully integrated into your strategy. The return on investment is clear, the path is proven, and the time to act is today.`,
        `I am personally committed to ensuring your success with ${topic}. With my support and the right resources, this is not just achievable — it is inevitable.`,
      ],
    ],
    casual: [
      [
        `${topic} is honestly pretty wild when you think about it. I stumbled across some interesting stuff and figured you'd want to know.`,
        `Been thinking about ${topic} a lot recently and I've got some thoughts. Nothing too serious, just wanted to share what's been on my mind.`,
      ],
      [
        `The more I look into ${topic}, the more interesting it gets. There's way more to it than I initially thought, which is kind of cool.`,
        `So yeah, ${topic} — it's kind of a big deal if you dig into it. Figured we should probably talk about it at some point.`,
      ],
      [
        `Anyway, that's basically where I'm at with ${topic}. Would be cool to hear your take on it too.`,
        `${topic} aside, I think there's a real opportunity here if we move on it soon. Just my two cents though!`,
      ],
    ],
  };

  const pool = paragraphs[tone][Math.min(index, paragraphs[tone].length - 1)];
  return pick(pool);
}

function generateSubject(topic: string, tone: EmailTone): string {
  const subjects: Record<EmailTone, string[]> = {
    formal: [
      `Regarding ${topic} — Important Communication`,
      `Formal Correspondence: ${topic}`,
      `For Your Attention: ${topic}`,
    ],
    friendly: [
      `Hey — quick note about ${topic}!`,
      `${topic} — wanted to share something cool`,
      `Thought you'd want to hear about ${topic} 😊`,
    ],
    persuasive: [
      `${topic}: An Opportunity You Can't Miss`,
      `Why ${topic} Changes Everything`,
      `Act Now: ${topic} — Limited Window`,
    ],
    casual: [
      `re: ${topic}`,
      `${topic} — just a thought`,
      `Quick thing about ${topic}`,
    ],
  };
  return pick(subjects[tone]);
}

// Mock implementation — replace generate() body with real API call when ready
class MockEmailGeneratorService implements EmailGeneratorService {
  async generate({ topic, tone, length }: EmailGenerationParams): Promise<GeneratedEmail> {
    // Simulate async AI latency
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const paragraphCount = LENGTH_PARAGRAPHS[length];
    const opener = pick(TONE_OPENERS[tone]);
    const closer = pick(TONE_CLOSERS[tone]);

    const bodyParagraphs = Array.from({ length: paragraphCount }, (_, i) =>
      buildParagraph(topic, tone, i)
    );

    const greeting =
      tone === "formal"
        ? "Dear Sir/Madam,"
        : tone === "casual"
        ? "Hey,"
        : "Hello,";

    const body = [
      greeting,
      "",
      `${opener} ${topic}.`,
      "",
      ...bodyParagraphs.join("\n\n").split("\n"),
      "",
      closer,
      "[Your Name]",
    ].join("\n");

    return {
      subject: generateSubject(topic, tone),
      body,
    };
  }
}

export const emailGeneratorService: EmailGeneratorService =
  new MockEmailGeneratorService();

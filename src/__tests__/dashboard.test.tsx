import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailGenerator } from "@/components/email-generator";

// Silence the next/navigation warning — EmailGenerator doesn't use it but
// @base-ui button may call it internally through the render tree.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => "/dashboard",
}));

// Provide a deterministic fetch mock so button clicks don't throw
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      subject: "Test Subject",
      body: "Dear Sir/Madam,\n\nTest body.\n\nBest regards,\n[Your Name]",
    }),
  } as Response);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("EmailGenerator component", () => {
  it("renders the email topic input field", () => {
    render(<EmailGenerator />);

    const input = screen.getByLabelText(/email topic/i);
    expect(input).toBeInTheDocument();
    // The input component doesn't set type explicitly — it defaults to text behaviour
    expect(input.tagName.toLowerCase()).toBe("input");
  });

  it("renders the topic input placeholder text", () => {
    render(<EmailGenerator />);

    expect(
      screen.getByPlaceholderText(/follow up on our product demo/i)
    ).toBeInTheDocument();
  });

  it("renders the Tone selector label", () => {
    render(<EmailGenerator />);

    expect(screen.getByText(/^Tone$/)).toBeInTheDocument();
  });

  it("renders the Length selector label", () => {
    render(<EmailGenerator />);

    expect(screen.getByText(/^Length$/)).toBeInTheDocument();
  });

  it("renders the Generate email button", () => {
    render(<EmailGenerator />);

    const button = screen.getByRole("button", { name: /generate email/i });
    expect(button).toBeInTheDocument();
  });

  it("Generate button is disabled when topic is empty", () => {
    render(<EmailGenerator />);

    const button = screen.getByRole("button", { name: /generate email/i });
    expect(button).toBeDisabled();
  });

  it("Generate button becomes enabled after typing a topic", async () => {
    const user = userEvent.setup();
    render(<EmailGenerator />);

    const input = screen.getByLabelText(/email topic/i);
    await user.type(input, "project kickoff");

    const button = screen.getByRole("button", { name: /generate email/i });
    expect(button).toBeEnabled();
  });

  it("typing in the topic field updates its value", async () => {
    const user = userEvent.setup();
    render(<EmailGenerator />);

    const input = screen.getByLabelText(/email topic/i) as HTMLInputElement;
    await user.type(input, "Hello world");

    expect(input.value).toBe("Hello world");
  });

  it("shows loading state while generating", async () => {
    // Make fetch hang so we can observe the loading state
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

    const user = userEvent.setup();
    render(<EmailGenerator />);

    await user.type(screen.getByLabelText(/email topic/i), "test topic");
    await user.click(screen.getByRole("button", { name: /generate email/i }));

    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });

  it("displays generated email output after successful generation", async () => {
    const user = userEvent.setup();
    render(<EmailGenerator />);

    await user.type(screen.getByLabelText(/email topic/i), "budget approval");
    await user.click(screen.getByRole("button", { name: /generate email/i }));

    // Wait for the result card to appear
    const subjectEl = await screen.findByText("Test Subject");
    expect(subjectEl).toBeInTheDocument();

    expect(screen.getByText(/Generated email/i)).toBeInTheDocument();
  });

  it("shows copy buttons after generation", async () => {
    const user = userEvent.setup();
    render(<EmailGenerator />);

    await user.type(screen.getByLabelText(/email topic/i), "budget approval");
    await user.click(screen.getByRole("button", { name: /generate email/i }));

    await screen.findByText("Test Subject");

    // "Copy all" button and individual Copy links
    expect(screen.getByRole("button", { name: /copy all/i })).toBeInTheDocument();
  });
});

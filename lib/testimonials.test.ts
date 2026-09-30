import { describe, expect, it } from "vitest";
import { createQuote, featuredEmbedHtml, parseQuotes, visibleQuotes, type Quote } from "./testimonials";

const quotes: Quote[] = [
  { id: "a", author: "Ann", quote: "Solid work", state: "Review" },
  { id: "b", author: "Bo", quote: "Shipped fast", state: "Featured" },
  { id: "c", author: "Cy", quote: "Old note", state: "Archive" },
  { id: "d", author: "Di", quote: "Great help", state: "Featured" },
];

describe("visibleQuotes", () => {
  it("puts featured first and keeps insertion order within a state", () => {
    expect(visibleQuotes(quotes, "").map((q) => q.id)).toEqual(["b", "d", "a", "c"]);
  });

  it("searches author, quote and state", () => {
    expect(visibleQuotes(quotes, "archive").map((q) => q.id)).toEqual(["c"]);
    expect(visibleQuotes(quotes, "ANN").map((q) => q.id)).toEqual(["a"]);
  });
});

describe("createQuote", () => {
  it("requires author and quote and strips wrapping quote marks", () => {
    expect(createQuote(" ", "x", "Review", "1")).toHaveProperty("error");
    expect(createQuote("Alex", " “Great!” ", "Featured", "1")).toEqual({ id: "1", author: "Alex", quote: "Great!", state: "Featured" });
  });
});

describe("parseQuotes", () => {
  it("drops malformed stored quotes", () => {
    expect(parseQuotes(JSON.stringify([quotes[0], { id: "x", author: "A", quote: "B", state: "Live" }]))).toEqual([quotes[0]]);
    expect(parseQuotes("oops")).toBeNull();
  });
});

describe("featuredEmbedHtml", () => {
  it("exports only Featured quotes, in order, with HTML escaped", () => {
    const quotes: Quote[] = [
      { id: "1", author: "Ann <CTO>", quote: 'Fast & "careful"', state: "Featured" },
      { id: "2", author: "Bo", quote: "Not yet", state: "Review" },
      { id: "3", author: "Cy", quote: "<script>alert(1)</script>", state: "Featured" },
    ];
    const html = featuredEmbedHtml(quotes);
    expect(html).toContain("<p>Fast &amp; &quot;careful&quot;</p>");
    expect(html).toContain("<figcaption>Ann &lt;CTO&gt;</figcaption>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("Not yet");
    expect(html.indexOf("Ann")).toBeLessThan(html.indexOf("Cy"));
  });

  it("is empty when nothing is featured", () => {
    expect(featuredEmbedHtml([{ id: "1", author: "A", quote: "q", state: "Archive" }])).toBe("");
  });
});

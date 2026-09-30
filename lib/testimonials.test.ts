import { describe, expect, it } from "vitest";
import { createQuote, parseQuotes, visibleQuotes, type Quote } from "./testimonials";

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

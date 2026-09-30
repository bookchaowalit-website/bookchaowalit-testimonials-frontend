export const STATES = ["Featured", "Review", "Archive"] as const;
export type State = (typeof STATES)[number];
export type Quote = { id: string; author: string; quote: string; state: State };

export const MAX_AUTHOR = 80;
export const MAX_QUOTE = 600;

const ORDER: Record<State, number> = { Featured: 0, Review: 1, Archive: 2 };

/** Search across author, quote and state; featured proofs sort first, stable otherwise. */
export function visibleQuotes(quotes: Quote[], query: string): Quote[] {
  const needle = query.trim().toLowerCase();
  return quotes
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => `${item.author} ${item.quote} ${item.state}`.toLowerCase().includes(needle))
    .sort((a, b) => ORDER[a.item.state] - ORDER[b.item.state] || a.index - b.index)
    .map(({ item }) => item);
}

export function createQuote(author: string, quote: string, state: State, id: string): Quote | { error: string } {
  const cleanAuthor = author.trim().slice(0, MAX_AUTHOR);
  const cleanQuote = quote.trim().replace(/^["“”]+|["“”]+$/g, "").trim().slice(0, MAX_QUOTE);
  if (!cleanAuthor || !cleanQuote) return { error: "Add both an author and a quote before exposing it." };
  return { id, author: cleanAuthor, quote: cleanQuote, state };
}

export function isState(value: unknown): value is State {
  return typeof value === "string" && (STATES as readonly string[]).includes(value);
}

export function parseQuotes(raw: string | null): Quote[] | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    return data.filter((item): item is Quote => {
      if (typeof item !== "object" || item === null) return false;
      const q = item as Record<string, unknown>;
      return typeof q.id === "string" && typeof q.author === "string" && typeof q.quote === "string" && isState(q.state);
    });
  } catch {
    return null;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Static, escaped HTML for the Featured quotes, in their current order, so the
 * curated set can be pasted into another site. Returns "" when none are featured.
 */
export function featuredEmbedHtml(quotes: Quote[]): string {
  const featured = quotes.filter((quote) => quote.state === "Featured");
  if (featured.length === 0) return "";
  const figures = featured.map(
    (quote) => `  <figure class="testimonial">\n    <blockquote><p>${escapeHtml(quote.quote)}</p></blockquote>\n    <figcaption>${escapeHtml(quote.author)}</figcaption>\n  </figure>`,
  );
  return `<section class="testimonials">\n${figures.join("\n")}\n</section>\n`;
}

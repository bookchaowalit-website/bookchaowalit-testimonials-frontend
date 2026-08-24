"use client";

import { useEffect, useMemo, useState } from "react";

type State = "Featured" | "Review" | "Archive";
type Quote = { id: string; author: string; quote: string; state: State };
const SEED: Quote[] = [{ id: "alex", author: "Alex", quote: "Shipped faster than expected.", state: "Featured" }];
const STATES: State[] = ["Featured", "Review", "Archive"];

function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>(SEED);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const raw = localStorage.getItem("testimonials-v2"); if (raw) setQuotes(JSON.parse(raw) as Quote[]); } catch { /* keep seed */ } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("testimonials-v2", JSON.stringify(quotes)); }, [quotes, ready]);
  return [quotes, setQuotes] as const;
}

export default function Home() {
  const [quotes, setQuotes] = useQuotes();
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");
  const [state, setState] = useState<State>("Review");
  const visible = useMemo(() => quotes.filter((item) => `${item.author} ${item.quote} ${item.state}`.toLowerCase().includes(query.toLowerCase())), [quotes, query]);
  const addQuote = () => {
    if (!author.trim() || !quote.trim()) return;
    setQuotes((current) => [{ id: crypto.randomUUID(), author: author.trim(), quote: quote.trim(), state }, ...current]);
    setAuthor(""); setQuote(""); setState("Review");
  };

  return (
    <main className="darkroom">
      <header className="darkroom-header">
        <div className="safelight"><span /><span /><span /></div>
        <div className="lab-name">B / PROOF ROOM</div><div className="lab-rule" /><span className="lab-note">Contact sheet · local demo</span>
      </header>
      <section className="darkroom-hero">
        <div><p className="lab-label">CUSTOMER VOICE / WORK PRINT</p><h1>Good work<br /><em>leaves a trace.</em></h1></div>
        <div className="exposure-readout"><span className="readout-number">{String(quotes.length).padStart(2, "0")}</span><span>proofs in<br />the tray</span><i /></div>
      </section>
      <section className="contact-sheet" aria-label="Testimonials contact sheet">
        <div className="sheet-head">
          <div><p className="lab-label">CONTACT SHEET 001</p><h2>Selected voices</h2></div>
          <label className="darkroom-search"><span>Read the margin</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search author or quote" /></label>
        </div>
        <div className="proof-grid">
          {visible.length === 0 ? <p className="empty-tray">No proof found in this exposure.</p> : visible.map((item, index) => (
            <article className={`proof ${item.state.toLowerCase()}`} key={item.id}>
              <div className="proof-top"><span>FRAME {String(index + 1).padStart(2, "0")}</span><button aria-label={`Delete testimonial by ${item.author}`} onClick={() => setQuotes((current) => current.filter((entry) => entry.id !== item.id))}>REMOVE</button></div>
              <blockquote>“{item.quote}”</blockquote><div className="proof-foot"><strong>{item.author}</strong><span>{item.state}</span></div>
            </article>
          ))}
        </div>
      </section>
      <section className="develop-tray">
        <div className="tray-copy"><p className="lab-label">DEVELOP A NEW PROOF</p><h2>Put a voice<br /><em>in the light.</em></h2><p>Quotes added here stay in this browser. They are not published to a live site.</p></div>
        <div className="tray-form">
          <label><span>Author / company</span><input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="e.g. Alex" /></label>
          <label><span>What did they say?</span><textarea value={quote} onChange={(event) => setQuote(event.target.value)} placeholder="A short, specific note..." rows={3} /></label>
          <label><span>Proof state</span><select value={state} onChange={(event) => setState(event.target.value as State)}>{STATES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className="develop-button" onClick={addQuote}>Expose quote <span>+</span></button>
        </div>
      </section>
      <footer className="darkroom-footer"><span>BOOKCHAOWALIT / TESTIMONIALS</span><span>NO FABRICATED RESULTS · LOCAL BROWSER STATE</span></footer>
    </main>
  );
}

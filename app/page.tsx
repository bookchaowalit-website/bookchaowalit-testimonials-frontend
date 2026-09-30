"use client";

import { useMemo, useState, type FormEvent } from "react";
import { createQuote, MAX_AUTHOR, MAX_QUOTE, parseQuotes, STATES, visibleQuotes, type Quote, type State } from "@/lib/testimonials";
import { useStoredState } from "@/lib/use-stored-state";

const SEED: Quote[] = [{ id: "alex", author: "Alex", quote: "Shipped faster than expected.", state: "Featured" }];

export default function Home() {
  const [quotes, setQuotes] = useStoredState("testimonials-v2", SEED, parseQuotes);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");
  const [state, setState] = useState<State>("Review");
  const visible = useMemo(() => visibleQuotes(quotes, query), [quotes, query]);
  const addQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = createQuote(author, quote, state, crypto.randomUUID());
    if ("error" in next) { setNotice(next.error); return; }
    setQuotes((current) => [next, ...current]);
    setAuthor(""); setQuote(""); setState("Review"); setNotice(`Quote from ${next.author} added to the tray.`);
  };
  const restate = (id: string, next: State) => setQuotes((current) => current.map((entry) => entry.id === id ? { ...entry, state: next } : entry));

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
          <label className="darkroom-search"><span>Read the margin</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search author, quote or state" /></label>
        </div>
        <div className="proof-grid">
          {visible.length === 0 ? <p className="empty-tray">No proof found in this exposure.</p> : visible.map((item, index) => (
            <article className={`proof ${item.state.toLowerCase()}`} key={item.id}>
              <div className="proof-top"><span>FRAME {String(index + 1).padStart(2, "0")}</span><button type="button" aria-label={`Delete testimonial by ${item.author}`} onClick={() => setQuotes((current) => current.filter((entry) => entry.id !== item.id))}>REMOVE</button></div>
              <blockquote>“{item.quote}”</blockquote><div className="proof-foot"><strong>{item.author}</strong><label><span className="sr-only">State for quote by {item.author}</span><select className="proof-state" value={item.state} onChange={(event) => restate(item.id, event.target.value as State)}>{STATES.map((option) => <option key={option}>{option}</option>)}</select></label></div>
            </article>
          ))}
        </div>
      </section>
      <section className="develop-tray">
        <div className="tray-copy"><p className="lab-label">DEVELOP A NEW PROOF</p><h2>Put a voice<br /><em>in the light.</em></h2><p>Quotes added here stay in this browser. They are not published to a live site.</p></div>
        <form className="tray-form" onSubmit={addQuote}>
          <label><span>Author / company</span><input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="e.g. Alex" maxLength={MAX_AUTHOR} required /></label>
          <label><span>What did they say?</span><textarea value={quote} onChange={(event) => setQuote(event.target.value)} placeholder="A short, specific note..." rows={3} maxLength={MAX_QUOTE} required /></label>
          <label><span>Proof state</span><select value={state} onChange={(event) => setState(event.target.value as State)}>{STATES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className="develop-button" type="submit">Expose quote <span aria-hidden="true">+</span></button>
          <p className="tray-notice" role="status">{notice}</p>
        </form>
      </section>
      <footer className="darkroom-footer"><span>BOOKCHAOWALIT / TESTIMONIALS</span><span>NO FABRICATED RESULTS · LOCAL BROWSER STATE</span></footer>
    </main>
  );
}

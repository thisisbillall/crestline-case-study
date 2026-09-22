/**
 * THE CLIENT, NAMED IN THEIR OWN MARK.
 *
 * The case study talks about one company on every page, and "they" and "their"
 * stop carrying weight by the third paragraph. Saying Grey sets the name in the
 * serif and grey of their own wordmark, so the reader is reminded whose money
 * this is without the sentence having to say so again.
 */
export function Grey({ s = false }: { s?: boolean }) {
  return (
    <span className="font-serif text-[1.06em] leading-none text-ink/65">Grey{s ? "’s" : ""}</span>
  );
}

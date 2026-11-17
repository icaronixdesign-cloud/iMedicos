import { MARK_PATHS, WORD_PATHS } from "./logo-paths";

/** Logo horizontal: símbolo + palavra (mesmos vetores do logo original). */
export function LogoHorizontal({ className, title = "iMédicos" }: { className?: string; title?: string }) {
  return (
    <span className={`logo-h ${className ?? ""}`} role="img" aria-label={title}>
      <svg viewBox="0 0 814 770" className="logo-h__mark" aria-hidden="true" focusable="false">
        <g fill="currentColor" dangerouslySetInnerHTML={{ __html: MARK_PATHS }} />
      </svg>
      <svg viewBox="34 806 752 152" className="logo-h__word" aria-hidden="true" focusable="false">
        <g fill="currentColor" dangerouslySetInnerHTML={{ __html: WORD_PATHS }} />
      </svg>
    </span>
  );
}

/** Logo empilhado original (símbolo acima da palavra). */
export function LogoStacked({ className, title = "iMédicos" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 814.36 958" className={className} role="img" aria-label={title} focusable="false">
      <g fill="currentColor" dangerouslySetInnerHTML={{ __html: MARK_PATHS + WORD_PATHS }} />
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 814 770" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor" dangerouslySetInnerHTML={{ __html: MARK_PATHS }} />
    </svg>
  );
}

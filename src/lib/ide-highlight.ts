export type Token = {
  text: string;
  kind: "plain" | "keyword" | "string" | "comment" | "number";
};

const TOKEN_RE =
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|let|var|function|return|if|else|for|while|break|continue|new|typeof|of|in|true|false|null|undefined|async|await|try|catch|throw)\b|\b\d+(?:\.\d+)?\b/g;

function kindFor(match: string): Token["kind"] {
  if (match.startsWith("//") || match.startsWith("/*")) return "comment";
  if (match.startsWith('"') || match.startsWith("'") || match.startsWith("`")) return "string";
  if (match[0] >= "0" && match[0] <= "9") return "number";
  return "keyword";
}

export function highlight(code: string): Token[] {
  const tokens: Token[] = [];
  TOKEN_RE.lastIndex = 0;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(code))) {
    if (match.index > cursor) {
      tokens.push({ text: code.slice(cursor, match.index), kind: "plain" });
    }
    tokens.push({ text: match[0], kind: kindFor(match[0]) });
    cursor = match.index + match[0].length;
  }
  if (cursor < code.length) tokens.push({ text: code.slice(cursor), kind: "plain" });
  return tokens;
}

export function readSeries(result: string | undefined): number[] | null {
  if (!result) return null;
  const trimmed = result.trim();
  if (!trimmed.startsWith("[")) return null;
  try {
    const value: unknown = JSON.parse(trimmed);
    if (!Array.isArray(value) || value.length === 0 || value.length > 24) return null;
    if (!value.every((item) => typeof item === "number" && Number.isFinite(item))) return null;
    return value;
  } catch {
    return null;
  }
}

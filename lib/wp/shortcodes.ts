export type ShortcodeType = "affiliate" | "youtube";

export type ParsedBlock =
  | { type: "html"; content: string }
  | { type: ShortcodeType; attrs: Record<string, string> };

function decodeTypographicQuotes(str: string): string {
  return str
    .replace(/&#8220;|&#8221;|\u201C|\u201D|&ldquo;|&rdquo;|&#8243;|\u2033/g, '"')
    .replace(/&#8216;|&#8217;|\u2018|\u2019|&lsquo;|&rsquo;/g, "'");
}

function parseAttrs(str: string): Record<string, string> {
  const normalized = decodeTypographicQuotes(str);
  const attrs: Record<string, string> = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(normalized)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

export function parseShortcodes(html: string): ParsedBlock[] {
  const cleaned = html
    .replace(/<p>\s*(\[(affiliate|youtube)[^\]]*\])\s*<\/p>/gi, "$1")
    .replace(/<p>\s*<\/p>/gi, "");

  const SHORTCODE_REGEX = /\[(affiliate|youtube)([^\]]*)\]/g;
  const blocks: ParsedBlock[] = [];
  let lastIndex = 0;
  let match;

  while ((match = SHORTCODE_REGEX.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "html",
        content: cleaned.slice(lastIndex, match.index),
      });
    }

    blocks.push({
      type: match[1] as ShortcodeType,
      attrs: parseAttrs(match[2]),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleaned.length) {
    blocks.push({ type: "html", content: cleaned.slice(lastIndex) });
  }

  return blocks;
}
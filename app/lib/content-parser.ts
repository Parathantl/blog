/**
 * Server-side content parser for extracting structured data from HTML content.
 * Uses regex-based parsing (no DOM dependency) for SSR compatibility.
 */

/**
 * Strip all HTML tags from content.
 */
export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Calculate word count from HTML content.
 */
export function calculateWordCount(html: string): number {
  const text = stripHTML(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Convert word count to ISO 8601 duration for reading time.
 * Assumes 200 words per minute reading speed.
 */
export function wordCountToISO8601(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200);
  if (minutes < 60) {
    return `PT${minutes}M`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `PT${hours}H${remainingMinutes}M` : `PT${hours}H`;
}

/**
 * Extract FAQ question/answer pairs from HTML content.
 * Looks for patterns like:
 * - <h2>Question?</h2><p>Answer text</p>
 * - <h3>Question?</h3><p>Answer text</p>
 * - <strong>Q: Question?</strong> Answer text
 *
 * Only returns pairs where the heading ends with '?' or starts with common FAQ patterns.
 */
export function extractFAQFromHTML(
  html: string
): Array<{ question: string; answer: string }> {
  const pairs: Array<{ question: string; answer: string }> = [];

  // Pattern 1: Heading followed by paragraph(s)
  // Match h2/h3/h4 headings that look like questions
  const headingPattern =
    /<h[2-4][^>]*>(.*?)<\/h[2-4]>\s*([\s\S]*?)(?=<h[2-4]|$)/gi;

  let match;
  while ((match = headingPattern.exec(html)) !== null) {
    const headingText = stripHTML(match[1]);
    const bodyHTML = match[2];

    // Check if it looks like a question
    const isQuestion =
      headingText.endsWith('?') ||
      /^(what|how|why|when|where|who|which|can|do|does|is|are|will|should)/i.test(
        headingText
      );

    if (isQuestion && bodyHTML) {
      // Extract text from paragraphs following the heading
      const paragraphs: string[] = [];
      const pPattern = /<p[^>]*>(.*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pPattern.exec(bodyHTML)) !== null) {
        const text = stripHTML(pMatch[1]);
        if (text) paragraphs.push(text);
      }

      // If no <p> tags, try to get any text content
      if (paragraphs.length === 0) {
        const bodyText = stripHTML(bodyHTML);
        if (bodyText) paragraphs.push(bodyText);
      }

      if (paragraphs.length > 0) {
        pairs.push({
          question: headingText,
          answer: paragraphs.join(' '),
        });
      }
    }
  }

  // Pattern 2: Strong/bold question followed by answer
  if (pairs.length < 2) {
    const strongPattern =
      /<(?:strong|b)[^>]*>\s*(?:Q[:.]?\s*)?(.*?\?)\s*<\/(?:strong|b)>\s*(.*?)(?=<(?:strong|b)|<h[2-4]|$)/gi;

    while ((match = strongPattern.exec(html)) !== null) {
      const question = stripHTML(match[1]);
      const answer = stripHTML(match[2]);

      if (question && answer) {
        pairs.push({ question, answer });
      }
    }
  }

  return pairs;
}

/**
 * Extract how-to steps from HTML content.
 * Looks for:
 * - Ordered list items (<ol><li>)
 * - Numbered headings (Step 1:, 1., etc.)
 * - H2/H3 headings with step-like content
 */
export function extractHowToSteps(
  html: string
): Array<{ name: string; text: string }> {
  const steps: Array<{ name: string; text: string }> = [];

  // Pattern 1: Ordered list items
  const olPattern = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
  let olMatch;
  while ((olMatch = olPattern.exec(html)) !== null) {
    const olContent = olMatch[1];
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liPattern.exec(olContent)) !== null) {
      const text = stripHTML(liMatch[1]);
      if (text) {
        // Use first sentence as name, full text as text
        const firstSentence = text.split(/[.!?]/)[0].trim();
        steps.push({
          name: firstSentence || text.substring(0, 100),
          text: text,
        });
      }
    }
  }

  // Pattern 2: Step headings (Step 1: ..., 1. ...)
  if (steps.length < 2) {
    steps.length = 0; // Reset if we try this pattern
    const stepHeadingPattern =
      /<h[2-4][^>]*>\s*(?:step\s*\d+[:.]\s*|^\d+[.)]\s*)(.*?)<\/h[2-4]>\s*([\s\S]*?)(?=<h[2-4]|$)/gi;

    let stepMatch;
    while ((stepMatch = stepHeadingPattern.exec(html)) !== null) {
      const name = stripHTML(stepMatch[1]);
      const bodyHTML = stepMatch[2];
      const text = stripHTML(bodyHTML).substring(0, 500);

      if (name && text) {
        steps.push({ name, text });
      }
    }
  }

  return steps;
}

/**
 * Extract table of contents from HTML heading hierarchy.
 */
export function extractTableOfContents(
  html: string
): Array<{ level: number; text: string; id: string }> {
  const toc: Array<{ level: number; text: string; id: string }> = [];
  const headingPattern = /<h([2-4])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[2-4]>/gi;

  let match;
  while ((match = headingPattern.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = stripHTML(match[3]);
    const id =
      match[2] ||
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (text) {
      toc.push({ level, text, id });
    }
  }

  return toc;
}

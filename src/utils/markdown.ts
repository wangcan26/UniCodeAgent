import { marked } from 'marked';
import * as DOMPurify from 'dompurify';

/**
 * Renders markdown content to sanitized HTML
 * @param md Markdown content to render
 * @returns Sanitized HTML string
 */
export function renderMarkdown(md: string): string {
  // Configure marked options
  marked.setOptions({
    gfm: true, // GitHub flavored markdown
    breaks: true // Convert line breaks to <br>
  });

  // Parse markdown and sanitize HTML
  return DOMPurify.sanitize(marked.parse(md) as string);
}

/**
 * Type for markdown rendering options
 */
export interface MarkdownOptions {
  gfm?: boolean;
  breaks?: boolean;
}

// /**
//  * Renders markdown with custom options
//  * @param md Markdown content
//  * @param options Rendering options
//  * @returns Sanitized HTML string
//  */
// export async function renderMarkdownWithOptions(
//   md: string,
//   options: MarkdownOptions = {}
// ): Promise<string> {
//   marked.setOptions({
//     gfm: options.gfm ?? true,
//     breaks: options.breaks ?? true
//   });

//   return DOMPurify.sanitize(await marked.parse(md) as string);
// }

import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import hljs from 'highlight.js';
import katex from 'katex';

marked.use(
  markedKatex({
    throwOnError: false,
    output: 'html',
  }),
);

const renderer = new marked.Renderer();

renderer.code = function ({
  text,
  lang,
}: {
  text: string;
  lang?: string;
  escaped?: boolean;
}) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    } catch (err) {
      console.error('Highlight error:', err);
    }
  }

  const highlighted = hljs.highlightAuto(text).value;
  return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

renderer.image = function ({
  href,
  title,
  text,
}: {
  href: string | null;
  title?: string | null;
  text: string;
}) {
  if (!href) return text;
  const titleAttr = title ? ` title="${title}"` : '';
  return `<img src="${href}" alt="${text}"${titleAttr} class="w-full h-auto rounded-sm border border-darkGrey my-8" loading="lazy" />`;
};

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true,
});

const decodeHtmlEntities = (value: string): string =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const renderLatexPreview = (latex: string): string => {
  const decoded = decodeHtmlEntities(latex.trim());
  try {
    return katex.renderToString(decoded, {
      throwOnError: false,
      displayMode: true,
    });
  } catch {
    return `<pre class="blog-latex-fallback">${decoded}</pre>`;
  }
};

/**
 * Normalize Hashnode export quirks before marked parses the body.
 */
export const preprocessHashnodeMarkdown = (
  markdown: string,
): { content: string; placeholders: string[] } => {
  let content = markdown;

  // Protect native HTML blocks that must survive markdown parsing.
  const placeholders: string[] = [];
  const stash = (html: string) => {
    const token = `@@BLOG_HTML_${placeholders.length}@@`;
    placeholders.push(html);
    return token;
  };

  // Collapsible Hashnode details sections (may contain HTML + latex-preview).
  content = content.replace(
    /<details\b[^>]*>[\s\S]*?<\/details>/gi,
    (block) => {
      const withLatex = block.replace(
        /<latex-preview\b[^>]*>([\s\S]*?)<\/latex-preview>/gi,
        (_, latex: string) => renderLatexPreview(latex),
      );
      // Clean Hashnode-only attributes on images inside details.
      const cleaned = withLatex
        .replace(/\s+isuploading="[^"]*"/gi, '')
        .replace(/\s+align="[^"]*"/gi, '')
        .replace(
          /<img\b([^>]*?)>/gi,
          '<img$1 class="w-full h-auto rounded-sm border border-darkGrey my-6" loading="lazy">',
        );
      return stash(cleaned);
    },
  );

  // Standalone Hashnode latex-preview nodes outside details.
  content = content.replace(
    /<latex-preview\b[^>]*>([\s\S]*?)<\/latex-preview>/gi,
    (_, latex: string) => stash(renderLatexPreview(latex)),
  );

  // Raw <img> tags from Hashnode editor.
  content = content.replace(/<img\b[^>]*>/gi, (imgTag) => {
    const cleaned = imgTag
      .replace(/\s+isuploading="[^"]*"/gi, '')
      .replace(/\s+align="[^"]*"/gi, '');
    if (/class="/i.test(cleaned)) {
      return stash(cleaned);
    }
    return stash(
      cleaned.replace(
        /<img\b/i,
        '<img class="w-full h-auto rounded-sm border border-darkGrey my-8" loading="lazy"',
      ),
    );
  });

  // Hashnode image markdown: ![](url align="center")
  content = content.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\s+align="[^"]+"\)/g,
    '![$1]($2)',
  );

  return { content, placeholders };
};

export const renderBlogMarkdown = async (markdown: string): Promise<string> => {
  const { content, placeholders } = preprocessHashnodeMarkdown(markdown);
  let html = await marked.parse(content);

  placeholders.forEach((htmlBlock, index) => {
    html = html.replace(`@@BLOG_HTML_${index}@@`, htmlBlock);
    // marked may wrap bare tokens in <p>
    html = html.replace(`<p>@@BLOG_HTML_${index}@@</p>`, htmlBlock);
  });

  return html
    .replace(/<table>/g, '<div class="table-wrapper"><table>')
    .replace(/<\/table>/g, '</table></div>');
};

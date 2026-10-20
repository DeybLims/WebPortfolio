import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function MarkdownView({ source }: { source: string }) {
  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          a: ({ href, children }) => {
            const external = typeof href === "string" && /^https?:/i.test(href);
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {source || ""}
      </ReactMarkdown>
    </div>
  );
}

"use client";

import * as React from "react";

export function ShareBar({
  title,
  url,
  text,
}: {
  title: string;
  url: string;
  text?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    try {
      await navigator.share({ title, text: text || title, url });
    } catch {
      /* The visitor dismissed the share sheet. */
    }
  }

  const encoded = encodeURIComponent(url);
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
  const x = `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
  const messenger = `https://www.facebook.com/dialog/send?link=${encoded}&redirect_uri=${encoded}&display=popup`;

  return (
    <div className="share-bar" role="group" aria-label="Share this post">
      <span className="meta">Share</span>
      <button type="button" className="text-button" onClick={() => void copy()}>
        {copied ? "Copied" : "Copy link"}
      </button>
      {canShare ? (
        <button type="button" className="text-button" onClick={() => void share()} aria-label="Share using the device share sheet">
          Share
        </button>
      ) : null}
      <a className="text-link" href={facebook} target="_blank" rel="noreferrer">
        Facebook
      </a>
      <a className="text-link" href={x} target="_blank" rel="noreferrer">
        X
      </a>
      <a className="text-link" href={linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <a className="text-link" href={messenger} target="_blank" rel="noreferrer">
        Messenger
      </a>
      <span className="share-status" role="status">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}

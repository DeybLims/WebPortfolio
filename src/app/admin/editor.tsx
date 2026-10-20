"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MarkdownView } from "@/components/blog/markdown";
import type { Post } from "@/lib/blog-types";
import { slugify } from "@/lib/slug";
import { deletePost, savePost, uploadCover } from "@/app/admin/actions";

type Draft = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  previousSlug: string | null;
};

const emptyDraft = (): Draft => ({
  id: null,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: "",
  cover_image_url: null,
  published: false,
  published_at: null,
  previousSlug: null,
});

function fromPost(post: Post): Draft {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    tags: post.tags.join(", "),
    cover_image_url: post.cover_image_url,
    published: post.published,
    published_at: post.published_at,
    previousSlug: post.slug,
  };
}

export function PostEditor({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [draft, setDraft] = React.useState<Draft>(emptyDraft);
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  function load(post: Post) {
    setDraft(fromPost(post));
    setSlugTouched(true);
    setStatus("");
    setConfirming(false);
  }

  function startNew() {
    setDraft(emptyDraft());
    setSlugTouched(false);
    setStatus("");
    setConfirming(false);
  }

  async function persist(published: boolean) {
    setPending(true);
    setStatus("");
    const tags = draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const result = await savePost({
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      content: draft.content,
      tags,
      cover_image_url: draft.cover_image_url,
      published,
      published_at: published ? draft.published_at : draft.published_at,
      previousSlug: draft.previousSlug,
    });
    setPending(false);
    if ("error" in result) {
      setStatus(result.error);
      return;
    }
    setDraft((current) => ({
      ...current,
      id: result.id,
      slug: result.slug,
      published,
      published_at: published ? current.published_at ?? new Date().toISOString() : current.published_at,
      previousSlug: result.slug,
    }));
    setSlugTouched(true);
    setStatus(published ? "Published." : "Draft saved.");
    router.refresh();
  }

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPending(true);
    setStatus("");
    const body = new FormData();
    body.set("file", file);
    const result = await uploadCover(body);
    setPending(false);
    if ("error" in result) {
      setStatus(result.error);
      return;
    }
    setDraft((current) => ({ ...current, cover_image_url: result.url }));
    setStatus("Cover uploaded.");
  }

  async function onDelete() {
    if (!draft.id) return;
    setPending(true);
    const result = await deletePost(draft.id, draft.slug);
    setPending(false);
    dialogRef.current?.close();
    setConfirming(false);
    if ("error" in result) {
      setStatus(result.error);
      return;
    }
    startNew();
    setStatus("Post deleted.");
    router.refresh();
  }

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (confirming && !dialog.open) dialog.showModal();
    if (!confirming && dialog.open) dialog.close();
    return undefined;
  }, [confirming]);

  return (
    <div className="admin-layout">
      <div className="admin-list">
        <button type="button" className="button-ink" onClick={startNew}>
          New post
        </button>
        <ul className="admin-posts">
          {posts.length === 0 ? <li className="admin-note">No posts yet.</li> : null}
          {posts.map((post) => (
            <li key={post.id}>
              <button
                type="button"
                className={draft.id === post.id ? "admin-post is-current" : "admin-post"}
                aria-current={draft.id === post.id ? "true" : undefined}
                onClick={() => load(post)}
              >
                <span>{post.title || "Untitled"}</span>
                <span className="meta">{post.published ? "Published" : "Draft"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form
        className="admin-editor"
        onSubmit={(event) => {
          event.preventDefault();
          void persist(draft.published);
        }}
      >
        <div className="admin-editor-fields">
          <label className="admin-field">
            <span>Title</span>
            <input
              value={draft.title}
              onChange={(event) => {
                const title = event.target.value;
                setDraft((current) => ({
                  ...current,
                  title,
                  slug: slugTouched ? current.slug : slugify(title),
                }));
              }}
              required
            />
          </label>
          <label className="admin-field">
            <span>Slug</span>
            <input
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true);
                setDraft((current) => ({ ...current, slug: event.target.value }));
              }}
              required
              spellCheck={false}
            />
          </label>
          <label className="admin-field">
            <span>Excerpt</span>
            <textarea
              value={draft.excerpt}
              rows={3}
              onChange={(event) => setDraft((current) => ({ ...current, excerpt: event.target.value }))}
            />
          </label>
          <label className="admin-field">
            <span>Tags</span>
            <input
              value={draft.tags}
              onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))}
              placeholder="comma separated"
            />
          </label>
          <div className="admin-field">
            <span>Cover image</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void onUpload(event)} />
            {draft.cover_image_url ? (
              <span className="admin-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={draft.cover_image_url} alt="" />
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setDraft((current) => ({ ...current, cover_image_url: null }))}
                >
                  Remove cover
                </button>
              </span>
            ) : null}
          </div>
        </div>

        <div className="editor-split">
          <label className="admin-field">
            <span>Markdown</span>
            <textarea
              className="editor-input"
              value={draft.content}
              onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
              spellCheck
            />
          </label>
          <div className="editor-preview" role="region" aria-label="Preview">
            <p className="meta">Preview</p>
            <MarkdownView source={draft.content} />
          </div>
        </div>

        <div className="admin-actions">
          {draft.published ? null : (
            <button type="button" className="text-button" disabled={pending} onClick={() => void persist(false)}>
              Save draft
            </button>
          )}
          <button type="button" className="button-ink" disabled={pending} onClick={() => void persist(true)}>
            {draft.published ? "Update" : "Publish"}
          </button>
          {draft.published ? (
            <button type="button" className="text-button" disabled={pending} onClick={() => void persist(false)}>
              Unpublish
            </button>
          ) : null}
          {draft.id ? (
            <button type="button" className="text-button admin-delete" disabled={pending} onClick={() => setConfirming(true)}>
              Delete
            </button>
          ) : null}
          {draft.published && draft.previousSlug ? (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                const link = new URL(`/blog/${draft.previousSlug}`, window.location.origin).href;
                void navigator.clipboard.writeText(link).then(() => {
                  setLinkCopied(true);
                  window.setTimeout(() => setLinkCopied(false), 2000);
                });
              }}
            >
              {linkCopied ? "Link copied" : "Copy post link"}
            </button>
          ) : null}
          <p className="admin-status" role="status">
            {pending ? "Saving…" : linkCopied ? "Link copied" : status}
          </p>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        className="admin-dialog"
        aria-labelledby="delete-title"
        onClose={() => setConfirming(false)}
      >
        <h2 id="delete-title" className="type-title">
          Delete this post?
        </h2>
        <p className="admin-note">This removes the post. It cannot be undone.</p>
        <div className="admin-actions">
          <button type="button" className="text-button" onClick={() => dialogRef.current?.close()}>
            Cancel
          </button>
          <button type="button" className="button-ink" disabled={pending} onClick={() => void onDelete()}>
            Delete
          </button>
        </div>
      </dialog>
    </div>
  );
}

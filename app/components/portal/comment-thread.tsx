import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Comment, ProjectStaffRef, UpdateAuthorRef } from "~/lib/types";
import { MessageSquare, Reply } from "lucide-react";

function authorName(ref: UpdateAuthorRef | string) {
  if (typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function initials(ref: UpdateAuthorRef | string) {
  if (typeof ref === "string") return "?";
  return `${ref.firstName[0] ?? ""}${ref.lastName[0] ?? ""}`.toUpperCase();
}

// Avatars are already resolved to absolute URLs server-side — see
// resolveCommentAvatars in api.server.ts and the loaders/actions that feed
// this component.
function avatarUrl(ref: UpdateAuthorRef | string): string | undefined {
  if (typeof ref === "string") return undefined;
  return ref.avatar || undefined;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Shared thread UI for the three commentable surfaces (general project
 * discussion, a task, a file) — see backend/src/modules/comment. `endpoint`
 * is the resolved nested-resource path (e.g. `/portal/tasks/:id/comments`);
 * this component doesn't know or care which subject it's attached to.
 *
 * When `fullPage` is true, the component removes its height constraint,
 * enables reply-to threading, and uses a layout suited for a dedicated
 * Discussion tab rather than an embedded card.
 *
 * "Mention" here is a checkbox list of project members to notify, not
 * inline `@name` parsing — same information (who gets pinged), a simpler
 * interaction to build and to use from a small dialog.
 */
export function CommentThread({
  endpoint,
  comments,
  currentUserId,
  isStaff,
  mentionable,
  fullPage = false,
}: {
  endpoint: string;
  comments: Comment[];
  currentUserId: string;
  isStaff: boolean;
  mentionable: ProjectStaffRef[];
  /** When true, removes height constraints and enables reply-to threading. */
  fullPage?: boolean;
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [mentions, setMentions] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new comments arrive (fullPage only).
  const prevCount = useRef(comments.length);
  useEffect(() => {
    if (fullPage && comments.length > prevCount.current) {
      threadRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    prevCount.current = comments.length;
  }, [comments.length, fullPage]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        setBody("");
        setMentions([]);
        setInternal(false);
        setReplyTo(null);
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const toggleMention = (id: string) => {
    setMentions((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const startReply = (comment: Comment) => {
    setReplyTo(comment);
    // Scroll the compose box into view so the user sees where they're typing
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        }),
      50,
    );
  };

  // Build a tree structure for fullPage mode: top-level comments with their replies nested
  const topLevel = comments.filter((c) => !c.parent);
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parent) {
      const siblings = repliesByParent.get(c.parent) ?? [];
      siblings.push(c);
      repliesByParent.set(c.parent, siblings);
    }
  }

  const renderComment = (c: Comment, isReply = false) => {
    const url = avatarUrl(c.author);
    const replies = fullPage ? (repliesByParent.get(c._id) ?? []) : [];

    return (
      <div key={c._id} className={isReply ? "ml-8 mt-2" : ""}>
        <div
          className={"flex gap-2.5 group" + (c.internal ? " opacity-75" : "")}
        >
          <Avatar
            size="sm"
            className={fullPage ? "size-8 shrink-0" : "size-6 shrink-0"}
          >
            {url && <AvatarImage src={url} alt="" />}
            <AvatarFallback className={fullPage ? "text-xs" : "text-[10px]"}>
              {initials(c.author)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p
                className={
                  fullPage
                    ? "text-sm font-medium text-white"
                    : "text-sm text-white"
                }
              >
                {authorName(c.author)}
              </p>
              {c.internal && (
                <span className="text-[9px] uppercase tracking-wide text-amber-400/80 border border-amber-400/30 rounded px-1">
                  Internal
                </span>
              )}
              <p className="text-[10px] text-white/30">
                {timeAgo(c.createdAt)}
              </p>
            </div>
            <p
              className={
                (fullPage ? "text-sm" : "text-sm") +
                " text-white/70 whitespace-pre-wrap mt-0.5"
              }
            >
              {c.body}
            </p>
            {/* Reply button — only in fullPage mode, only on top-level comments */}
            {fullPage && !isReply && (
              <button
                type="button"
                onClick={() => startReply(c)}
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Reply className="size-3" />
                Reply
              </button>
            )}
          </div>
        </div>
        {/* Render nested replies */}
        {replies.map((r) => renderComment(r, true))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {!fullPage && (
        <div className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-wide">
          <MessageSquare className="size-3.5" />
          {comments.length === 0
            ? "No comments yet"
            : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
        </div>
      )}

      {comments.length > 0 && (
        <div
          ref={threadRef}
          className={
            fullPage ? "space-y-4" : "space-y-3 max-h-72 overflow-y-auto pr-1"
          }
        >
          {fullPage
            ? topLevel.map((c) => renderComment(c))
            : comments.map((c) => (
                <div
                  key={c._id}
                  className={"flex gap-2.5" + (c.parent ? " ml-6" : "")}
                >
                  <Avatar size="sm" className="size-6 shrink-0">
                    {avatarUrl(c.author) && (
                      <AvatarImage src={avatarUrl(c.author)!} alt="" />
                    )}
                    <AvatarFallback className="text-[10px]">
                      {initials(c.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm text-white">
                        {authorName(c.author)}
                      </p>
                      {c.internal && (
                        <span className="text-[9px] uppercase tracking-wide text-amber-400/80 border border-amber-400/30 rounded px-1">
                          Internal
                        </span>
                      )}
                      <p className="text-[10px] text-white/30">
                        {timeAgo(c.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-white/70 whitespace-pre-wrap">
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      )}

      {fullPage && comments.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] py-12 text-center">
          <MessageSquare className="size-8 mx-auto text-white/15 mb-3" />
          <p className="text-sm text-white/40 font-medium">No discussion yet</p>
          <p className="text-xs text-white/25 mt-1">
            Start the conversation — ask questions, share context, or flag
            concerns.
          </p>
        </div>
      )}

      <fetcher.Form
        ref={formRef}
        method="post"
        className={
          fullPage
            ? "space-y-3 pt-4 border-t border-white/10 sticky bottom-0 bg-[#0a0a0b]/95 backdrop-blur-sm pb-2 -mx-5 px-5"
            : "space-y-2 pt-2 border-t border-white/10"
        }
        onSubmit={(e) => {
          if (!body.trim()) e.preventDefault();
        }}
      >
        <input type="hidden" name="intent" value="comment" />
        <input type="hidden" name="endpoint" value={endpoint} />
        <input type="hidden" name="mentions" value={JSON.stringify(mentions)} />
        {replyTo && <input type="hidden" name="parent" value={replyTo._id} />}

        {replyTo && (
          <div className="flex items-center gap-2 text-xs text-white/40 bg-white/[0.03] rounded-md px-3 py-1.5">
            <Reply className="size-3" />
            <span>
              Replying to{" "}
              <span className="text-white/60 font-medium">
                {authorName(replyTo.author)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="ml-auto text-white/30 hover:text-white/60"
            >
              ✕
            </button>
          </div>
        )}

        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
          className={fullPage ? "h-20 text-sm" : "h-16 text-sm"}
          name="body"
        />
        {mentionable.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mentionable
              .filter((m) => m._id !== currentUserId)
              .map((member) => (
                <label
                  key={member._id}
                  className="flex items-center gap-1.5 text-xs text-white/50"
                >
                  <Checkbox
                    checked={mentions.includes(member._id)}
                    onCheckedChange={() => toggleMention(member._id)}
                  />
                  Notify {member.firstName}
                </label>
              ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          {isStaff ? (
            <label className="flex items-center gap-1.5 text-xs text-white/50">
              <Checkbox
                checked={internal}
                onCheckedChange={(v) => setInternal(v === true)}
                name="internal"
              />
              Internal note (hidden from client)
            </label>
          ) : (
            <span />
          )}
          <Button type="submit" size="sm" disabled={isSaving || !body.trim()}>
            {isSaving ? "Posting..." : replyTo ? "Reply" : "Post"}
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}

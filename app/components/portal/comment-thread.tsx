import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import type { Comment, ProjectStaffRef, UpdateAuthorRef } from "~/lib/types";
import { MessageSquare } from "lucide-react";

function authorName(ref: UpdateAuthorRef | string) {
  if (typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function initials(ref: UpdateAuthorRef | string) {
  if (typeof ref === "string") return "?";
  return `${ref.firstName[0] ?? ""}${ref.lastName[0] ?? ""}`.toUpperCase();
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
}: {
  endpoint: string;
  comments: Comment[];
  currentUserId: string;
  isStaff: boolean;
  mentionable: ProjectStaffRef[];
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [mentions, setMentions] = useState<string[]>([]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        setBody("");
        setMentions([]);
        setInternal(false);
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const toggleMention = (id: string) => {
    setMentions((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-medium text-white/50 uppercase tracking-wide">
        <MessageSquare className="size-3.5" />
        {comments.length === 0 ? "No comments yet" : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
      </div>

      {comments.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c._id} className={"flex gap-2.5" + (c.parent ? " ml-6" : "")}>
              <Avatar size="sm" className="size-6 shrink-0">
                <AvatarFallback className="text-[10px]">{initials(c.author)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm text-white">{authorName(c.author)}</p>
                  {c.internal && (
                    <span className="text-[9px] uppercase tracking-wide text-amber-400/80 border border-amber-400/30 rounded px-1">
                      Internal
                    </span>
                  )}
                  <p className="text-[10px] text-white/30">{timeAgo(c.createdAt)}</p>
                </div>
                <p className="text-sm text-white/70 whitespace-pre-wrap">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <fetcher.Form
        method="post"
        className="space-y-2 pt-2 border-t border-white/10"
        onSubmit={(e) => {
          if (!body.trim()) e.preventDefault();
        }}
      >
        <input type="hidden" name="intent" value="comment" />
        <input type="hidden" name="endpoint" value={endpoint} />
        <input type="hidden" name="mentions" value={JSON.stringify(mentions)} />
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="h-16 text-sm"
          name="body"
        />
        {mentionable.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mentionable
              .filter((m) => m._id !== currentUserId)
              .map((member) => (
                <label key={member._id} className="flex items-center gap-1.5 text-xs text-white/50">
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
              <Checkbox checked={internal} onCheckedChange={(v) => setInternal(v === true)} name="internal" />
              Internal note (hidden from client)
            </label>
          ) : (
            <span />
          )}
          <Button type="submit" size="sm" disabled={isSaving || !body.trim()}>
            {isSaving ? "Posting..." : "Post"}
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}

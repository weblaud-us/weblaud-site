import { useOutletContext } from "react-router";
import type { Route } from "./+types/projects.$id.discussion";
import { apiFetch, ApiError, resolveCommentAvatars } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Comment, ProjectStaffRef } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { CommentThread } from "~/components/portal/comment-thread";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const comments = await callPortalApi(request, (accessToken) =>
    apiFetch<Comment[]>(`/portal/projects/${params.id}/comments`, {
      accessToken,
    }),
  );
  // Avatars arrive as storage paths — resolve them here, not in the
  // CommentThread component (api.server.ts is server-only).
  return { comments: resolveCommentAvatars(comments) };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    const bodyObj: Record<string, unknown> = {
      body: String(formData.get("body") ?? ""),
      internal: formData.get("internal") === "on",
      mentions: JSON.parse(String(formData.get("mentions") ?? "[]")),
    };

    // Wire up threaded replies — the backend's CreateCommentDto accepts an
    // optional `parent` comment id. Without this, every comment is top-level.
    const parent = formData.get("parent");
    if (parent) {
      bodyObj.parent = String(parent);
    }

    await callPortalApi(request, (accessToken) =>
      apiFetch(`/portal/projects/${params.id}/comments`, {
        method: "POST",
        accessToken,
        body: bodyObj,
      }),
    );
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

export default function PortalProjectDiscussion({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { comments } = loaderData;
  const { user, project } = useOutletContext<ProjectWorkspaceContext>();
  const isStaff = user.role === "admin" || user.role === "manager";

  const team = project.team as ProjectStaffRef[];
  const pm = project.projectManager as ProjectStaffRef;
  const mentionable = [
    ...(pm && typeof pm === "object" ? [pm] : []),
    ...team,
  ].filter(
    (member, index, all) =>
      all.findIndex((m) => m._id === member._id) === index,
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Project Discussion
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Ask questions, share context, or flag concerns. Tick a teammate under
          the message box to notify them.
          {isStaff && " Internal notes are visible only to staff."}
        </p>
      </div>
      <CommentThread
        endpoint={`/portal/projects/${params.id}/comments`}
        comments={comments}
        currentUserId={user._id}
        isStaff={isStaff}
        mentionable={mentionable}
        fullPage
      />
    </div>
  );
}

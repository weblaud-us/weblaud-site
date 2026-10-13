import { useOutletContext } from "react-router";
import type { Route } from "./+types/projects.$id.discussion";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Comment, ProjectStaffRef } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { CommentThread } from "~/components/portal/comment-thread";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const comments = await callPortalApi(request, (accessToken) =>
    apiFetch<Comment[]>(`/portal/projects/${params.id}/comments`, { accessToken }),
  );
  return { comments };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await callPortalApi(request, (accessToken) =>
      apiFetch(`/portal/projects/${params.id}/comments`, {
        method: "POST",
        accessToken,
        body: {
          body: String(formData.get("body") ?? ""),
          internal: formData.get("internal") === "on",
          mentions: JSON.parse(String(formData.get("mentions") ?? "[]")),
        },
      }),
    );
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

export default function PortalProjectDiscussion({ loaderData, params }: Route.ComponentProps) {
  const { comments } = loaderData;
  const { user, project } = useOutletContext<ProjectWorkspaceContext>();
  const isStaff = user.role === "admin" || user.role === "manager";

  const team = project.team as ProjectStaffRef[];
  const pm = project.projectManager as ProjectStaffRef;
  const mentionable = [...(pm && typeof pm === "object" ? [pm] : []), ...team].filter(
    (member, index, all) => all.findIndex((m) => m._id === member._id) === index,
  );

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-white/50 mb-4">
        General project discussion — for anything that isn't a formal update, task, or file comment.
      </p>
      <CommentThread
        endpoint={`/portal/projects/${params.id}/comments`}
        comments={comments}
        currentUserId={user._id}
        isStaff={isStaff}
        mentionable={mentionable}
      />
    </div>
  );
}

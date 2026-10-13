import { useEffect, useRef, useState } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.files";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Comment, ProjectFile, ProjectStaffRef } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Select } from "~/components/ui/select";
import { EmptyState } from "~/components/admin/empty-state";
import { CommentThread } from "~/components/portal/comment-thread";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FileText, Upload, Download, Trash2, MessageSquare } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const files = await callPortalApi(request, (accessToken) =>
    apiFetch<ProjectFile[]>(`/portal/projects/${params.id}/files`, { accessToken }),
  );
  return { files };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "upload") {
      formData.delete("intent");
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/files`, { method: "POST", accessToken, body: formData }),
      );
      return { ok: true };
    }
    if (intent === "visibility") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/files/${id}`, {
          method: "PATCH",
          accessToken,
          body: { visibility: String(formData.get("visibility")) },
        }),
      );
      return { ok: true };
    }
    if (intent === "delete") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/files/${id}`, { method: "DELETE", accessToken }),
      );
      return { ok: true };
    }
    if (intent === "comment") {
      const endpoint = String(formData.get("endpoint"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(endpoint, {
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
    }
    if (intent === "load-comments") {
      const endpoint = String(formData.get("endpoint"));
      const comments = await callPortalApi(request, (accessToken) =>
        apiFetch<Comment[]>(endpoint, { accessToken }),
      );
      return { ok: true, comments };
    }
    return { error: "Unknown action." };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uploaderName(ref: ProjectFile["uploadedBy"]) {
  if (typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function uploaderId(ref: ProjectFile["uploadedBy"]) {
  return typeof ref === "string" ? ref : ref._id;
}

function UploadButton({ projectId }: { projectId: string }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploading = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok && inputRef.current) inputRef.current.value = "";
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="hidden" name="intent" value="upload" />
      <input
        ref={inputRef}
        type="file"
        name="file"
        className="hidden"
        onChange={(e) => e.target.form?.requestSubmit()}
      />
      <Button type="button" size="sm" disabled={isUploading} onClick={() => inputRef.current?.click()}>
        <Upload className="size-3.5" />
        {isUploading ? "Uploading..." : "Upload file"}
      </Button>
    </fetcher.Form>
  );
}

function FileCommentsDialog({
  file,
  isStaff,
  currentUserId,
  mentionable,
}: {
  file: ProjectFile;
  isStaff: boolean;
  currentUserId: string;
  mentionable: ProjectStaffRef[];
}) {
  const [open, setOpen] = useState(false);
  const loadFetcher = useFetcher<{ ok?: boolean; comments?: Comment[] }>();
  const endpoint = `/portal/files/${file._id}/comments`;

  useEffect(() => {
    if (open) loadFetcher.submit({ intent: "load-comments", endpoint }, { method: "post" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <MessageSquare className="size-3.5" />
        Comments
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <CommentThread
          endpoint={endpoint}
          comments={loadFetcher.data?.comments ?? []}
          currentUserId={currentUserId}
          isStaff={isStaff}
          mentionable={mentionable}
        />
      </DialogContent>
    </Dialog>
  );
}

function VisibilityToggle({ file, isStaff }: { file: ProjectFile; isStaff: boolean }) {
  const fetcher = useFetcher();
  if (!isStaff) {
    return (
      <Badge variant={file.visibility === "client" ? "default" : "secondary"}>
        {file.visibility === "client" ? "Client-visible" : "Internal"}
      </Badge>
    );
  }
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="visibility" />
      <input type="hidden" name="id" value={file._id} />
      <Select
        name="visibility"
        defaultValue={file.visibility}
        onChange={(e) => fetcher.submit(e.currentTarget.form)}
        className="!py-1.5 !px-2 text-xs"
      >
        <option value="internal">Internal</option>
        <option value="client">Client-visible</option>
      </Select>
    </fetcher.Form>
  );
}

function DeleteFileButton({ id }: { id: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="delete" />
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline" size="sm" disabled={isDeleting} aria-label="Delete file">
        <Trash2 className="size-3.5" />
      </Button>
    </fetcher.Form>
  );
}

export default function PortalProjectFiles({ loaderData }: Route.ComponentProps) {
  const { files } = loaderData;
  const { user, isStaffOnProject, project } = useOutletContext<ProjectWorkspaceContext>();
  const isStaff = user.role === "admin" || user.role === "manager";

  const team = project.team as ProjectStaffRef[];
  const pm = project.projectManager as ProjectStaffRef;
  const mentionable = [...(pm && typeof pm === "object" ? [pm] : []), ...team].filter(
    (member, index, all) => all.findIndex((m) => m._id === member._id) === index,
  );

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <UploadButton projectId={project._id} />
      </div>

      {files.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState icon={FileText} title="No files yet" description="Upload deliverables, assets, or documents to share here." />
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3.5"
            >
              <FileText className="size-5 text-white/40 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">
                  {file.name}
                  {file.version > 1 && <span className="text-white/30 ml-1.5">v{file.version}</span>}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {formatSize(file.size)} · Uploaded by {uploaderName(file.uploadedBy)}
                  {file.folder && ` · ${file.folder}`}
                </p>
              </div>
              <VisibilityToggle file={file} isStaff={isStaffOnProject} />
              <FileCommentsDialog file={file} isStaff={isStaff} currentUserId={user._id} mentionable={mentionable} />
              <a href={`/portal/files/${file._id}/download`} target="_blank" rel="noreferrer">
                <Button type="button" variant="outline" size="sm" aria-label="Download">
                  <Download className="size-3.5" />
                </Button>
              </a>
              {(isStaffOnProject || uploaderId(file.uploadedBy) === user._id) && <DeleteFileButton id={file._id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

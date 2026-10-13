import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { PortalUser } from "~/lib/types";

/**
 * Self-service profile editor — shared by /portal/settings and
 * /cpadmin/settings. Posts multipart/form-data with intent=profile to
 * whatever route renders it; that route's action forwards to
 * PATCH /users/me (see users.controller.ts#updateMe). Deliberately no
 * email/role/organization fields — those aren't user-editable, see
 * UpdateProfileDto on the backend.
 */
export function ProfileForm({
  user,
  avatarUrl,
}: {
  user: PortalUser;
  /** Server-resolved absolute URL for user.avatar, if set — see resolveMediaUrl. */
  avatarUrl?: string;
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) toast.success("Profile updated.");
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <fetcher.Form method="post" encType="multipart/form-data" className="space-y-4">
          <input type="hidden" name="intent" value="profile" />

          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {preview && <AvatarImage src={preview} alt="" />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change photo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required defaultValue={user.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required defaultValue={user.lastName} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
            <p className="text-xs text-white/30">Contact an admin to change your email.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={user.title} placeholder="e.g. Project Manager" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={user.phone} />
            </div>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

/**
 * Shared by /portal/settings and /cpadmin/settings — including the admin's
 * own account. Posts intent=change-password to the hosting route's action,
 * which forwards to POST /auth/change-password. That endpoint verifies the
 * current password before setting a new one and revokes other sessions, so
 * a stolen-but-live token alone can't be used to lock the real owner out.
 */
export function ChangePasswordForm() {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        toast.success("Password updated. Your other sessions have been signed out.");
        (document.getElementById("change-password-form") as HTMLFormElement | null)?.reset();
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <fetcher.Form
          id="change-password-form"
          method="post"
          className="space-y-4 max-w-sm"
          onSubmit={(e) => {
            const form = e.currentTarget;
            const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value;
            const confirm = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
            if (newPassword !== confirm) {
              e.preventDefault();
              setConfirmError("Passwords don't match.");
              return;
            }
            setConfirmError(null);
          }}
        >
          <input type="hidden" name="intent" value="change-password" />

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
            {confirmError && <p className="text-red-400 text-xs">{confirmError}</p>}
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Updating..." : "Update password"}
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { EmailPreferences } from "~/lib/types";

const CATEGORIES: { key: keyof EmailPreferences; label: string; description: string }[] = [
  { key: "contracts", label: "Contracts", description: "New contracts sent for your review or signature." },
  { key: "invoices", label: "Invoices", description: "New invoices and overdue-payment reminders." },
  { key: "approvals", label: "Approvals", description: "Deliverables or milestones waiting on your sign-off." },
  { key: "changeRequests", label: "Change requests", description: "Priced scope changes waiting on your approval." },
  { key: "updates", label: "Project updates", description: "New progress updates published on your projects." },
  { key: "mentions", label: "Mentions", description: "Someone @mentioned you in a comment." },
  {
    key: "digest",
    label: "Weekly summary",
    description: "A Monday email with last week's progress and anything waiting on you.",
  },
];

const DEFAULTS: EmailPreferences = {
  contracts: true,
  invoices: true,
  approvals: true,
  changeRequests: true,
  updates: true,
  mentions: true,
  digest: true,
};

/**
 * Client-only in practice — every one of these categories only ever fans
 * out to clientIds/clientAdmins (see NotificationService's `email` calls in
 * contract/invoice/approval/change-request/project-update services), never
 * to staff. Still rendered for any portal user; a staff account just won't
 * ever receive anything these toggles would have blocked.
 */
export function EmailPreferencesForm({ preferences }: { preferences?: EmailPreferences }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const current = preferences ?? DEFAULTS;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) toast.success("Email preferences updated.");
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Email notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="email-preferences" />
          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <label key={cat.key} className="flex items-start gap-2.5">
                <Checkbox name={cat.key} defaultChecked={current[cat.key] !== false} className="mt-0.5" />
                <span>
                  <span className="block text-sm text-white/80">{cat.label}</span>
                  <span className="block text-xs text-white/40">{cat.description}</span>
                </span>
              </label>
            ))}
          </div>
          <Button type="submit" disabled={isSaving} size="sm">
            {isSaving ? "Saving..." : "Save preferences"}
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

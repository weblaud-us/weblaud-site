import { Link } from "react-router";
import type { Route } from "./+types/team.$id";
import { apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { TeamMember } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AdminPageHeader } from "~/components/admin/page-header";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request, params }: Route.LoaderArgs) {
  const member = await callAdminApi(request, (accessToken) =>
    apiFetch<TeamMember>(`/team/${params.id}`, { accessToken }),
  );
  return {
    member: {
      ...member,
      avatar: member.avatar ? resolveMediaUrl(member.avatar) : member.avatar,
    },
  };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminTeamMemberDetail({ loaderData }: Route.ComponentProps) {
  const { member } = loaderData;
  const socials = Object.entries(member.social ?? {}).filter(([, url]) => !!url);

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={member.name}
        description={member.title}
        backTo="/cpadmin/team"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={member.isActive ? "default" : "secondary"}>
              {member.isActive ? "Active" : "Hidden"}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>How this person appears on the About page.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="size-14">
                {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                <AvatarFallback>{initials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="text-white/90 font-medium">{member.name}</p>
                <p className="text-white/40 text-xs">{member.title}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social links</CardTitle>
            </CardHeader>
            <CardContent>
              {socials.length === 0 ? (
                <p className="text-sm text-white/40">No social links set.</p>
              ) : (
                <dl className="space-y-2 text-sm">
                  {socials.map(([network, url]) => (
                    <div key={network} className="flex justify-between gap-4">
                      <dt className="text-white/50 capitalize">{network}</dt>
                      <dd className="text-white/90 truncate">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0A84FF] hover:underline"
                        >
                          {url}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Record</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Order</dt>
                  <dd className="text-white/90">{member.order}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90">
                    <LocalTime value={member.createdAt} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/team"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to team
        </Link>
      </p>
    </div>
  );
}

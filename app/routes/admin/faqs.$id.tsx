import { Link } from "react-router";
import type { Route } from "./+types/faqs.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Faq } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request, params }: Route.LoaderArgs) {
  const faq = await callAdminApi(request, (accessToken) =>
    apiFetch<Faq>(`/faqs/${params.id}`, { accessToken }),
  );
  return { faq };
}

export default function AdminFaqDetail({ loaderData }: Route.ComponentProps) {
  const { faq } = loaderData;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={faq.question}
        description="FAQ entry shown on the marketing site."
        backTo="/cpadmin/faqs"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={faq.isActive ? "default" : "secondary"}>
              {faq.isActive ? "Active" : "Hidden"}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Answer</CardTitle>
              <CardDescription>Copy shown when the question is expanded.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 whitespace-pre-wrap">{faq.answer}</p>
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
                  <dd className="text-white/90">{faq.order}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90">
                    <LocalTime value={faq.createdAt} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/faqs"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to FAQs
        </Link>
      </p>
    </div>
  );
}

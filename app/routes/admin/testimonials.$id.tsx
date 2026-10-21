import { Link } from "react-router";
import type { Route } from "./+types/testimonials.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Testimonial } from "~/lib/types";
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
  const testimonial = await callAdminApi(request, (accessToken) =>
    apiFetch<Testimonial>(`/testimonials/${params.id}`, { accessToken }),
  );
  return { testimonial };
}

export default function AdminTestimonialDetail({ loaderData }: Route.ComponentProps) {
  const { testimonial } = loaderData;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={testimonial.authorName}
        description={testimonial.authorTitle}
        backTo="/cpadmin/testimonials"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={testimonial.isActive ? "default" : "secondary"}>
              {testimonial.isActive ? "Active" : "Hidden"}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quote</CardTitle>
              <CardDescription>Shown in the testimonials slider on the site.</CardDescription>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-2 border-white/10 pl-4 text-sm text-white/70 whitespace-pre-wrap">
                {testimonial.quote}
              </blockquote>
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
                  <dt className="text-white/50">Author</dt>
                  <dd className="text-white/90">{testimonial.authorName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Title</dt>
                  <dd className="text-white/90">{testimonial.authorTitle}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90">
                    <LocalTime value={testimonial.createdAt} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/testimonials"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to testimonials
        </Link>
      </p>
    </div>
  );
}

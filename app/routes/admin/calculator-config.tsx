import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/calculator-config";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { CalculatorConfig, RateOption, TimelineSpeed } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";

export async function loader({ request }: Route.LoaderArgs) {
  const config = await callAdminApi(request, (accessToken) =>
    apiFetch<CalculatorConfig>("/calculator-config", { accessToken }),
  );
  return { config };
}

/**
 * A bare `Number("")` is 0 and `Number("abc")` is NaN — both used to sail
 * through to the API and silently corrupt the live calculator. Collect the
 * problem instead so the admin sees it.
 */
function readNumber(
  value: FormDataEntryValue | undefined,
  label: string,
  errors: string[],
): number {
  const raw = String(value ?? "").trim();
  if (!raw) {
    errors.push(`${label} is required.`);
    return NaN;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    errors.push(`${label} must be a number.`);
    return NaN;
  }
  return parsed;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

/** Two options sharing an id silently break the find()-based wizard lookups. */
function assertUniqueIds(
  items: { id: string }[],
  groupLabel: string,
  errors: string[],
) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      errors.push(`${groupLabel} has a duplicate id: "${item.id}".`);
    }
    seen.add(item.id);
  }
}

function parseRateOptions(
  formData: FormData,
  prefix: string,
  label: string,
  errors: string[],
): RateOption[] {
  const ids = formData.getAll(`${prefix}.id`);
  const titles = formData.getAll(`${prefix}.title`);
  const descs = formData.getAll(`${prefix}.desc`);
  const weeks = formData.getAll(`${prefix}.weeks`);
  const multipliers = formData.getAll(`${prefix}.costMultiplier`);

  const items: RateOption[] = [];
  for (let i = 0; i < ids.length; i++) {
    const title = String(titles[i] ?? "").trim();
    if (!title) continue;
    items.push({
      id: String(ids[i] ?? "").trim() || slugify(title),
      title,
      desc: String(descs[i] ?? "").trim(),
      weeks: readNumber(weeks[i], `${label} "${title}" weeks`, errors),
      costMultiplier: readNumber(
        multipliers[i],
        `${label} "${title}" cost multiplier`,
        errors,
      ),
    });
  }

  assertUniqueIds(items, label, errors);
  return items;
}

function parseTimelineSpeeds(
  formData: FormData,
  errors: string[],
): TimelineSpeed[] {
  const ids = formData.getAll("timelineSpeeds.id");
  const labels = formData.getAll("timelineSpeeds.label");
  const multipliers = formData.getAll("timelineSpeeds.multiplier");
  const descs = formData.getAll("timelineSpeeds.desc");
  const weeksOffsets = formData.getAll("timelineSpeeds.weeksOffset");

  const items: TimelineSpeed[] = [];
  for (let i = 0; i < ids.length; i++) {
    const label = String(labels[i] ?? "").trim();
    if (!label) continue;
    items.push({
      id: String(ids[i] ?? "").trim() || slugify(label),
      label,
      multiplier: readNumber(
        multipliers[i],
        `Timeline speed "${label}" cost multiplier`,
        errors,
      ),
      desc: String(descs[i] ?? "").trim(),
      weeksOffset: readNumber(
        weeksOffsets[i],
        `Timeline speed "${label}" weeks offset`,
        errors,
      ),
    });
  }

  assertUniqueIds(items, "Timeline speeds", errors);
  return items;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const errors: string[] = [];

  const body: CalculatorConfig = {
    baseCost: readNumber(formData.get("baseCost") ?? undefined, "Base cost", errors),
    rangeSpreadPct: readNumber(
      formData.get("rangeSpreadPct") ?? undefined,
      "Range spread",
      errors,
    ),
    roundToNearest: readNumber(
      formData.get("roundToNearest") ?? undefined,
      "Rounding increment",
      errors,
    ),
    projectTypes: parseRateOptions(formData, "projectTypes", "Project type", errors),
    features: parseRateOptions(formData, "features", "Feature", errors),
    timelineSpeeds: parseTimelineSpeeds(formData, errors),
  };

  // Without either of these the public wizard has nothing to select.
  if (body.projectTypes.length === 0) {
    errors.push("At least one project type is required.");
  }
  if (body.timelineSpeeds.length === 0) {
    errors.push("At least one timeline speed is required.");
  }
  if (Number.isFinite(body.roundToNearest) && body.roundToNearest < 1) {
    errors.push("Rounding increment must be at least 1.");
  }

  if (errors.length > 0) {
    return { error: errors.join(" ") };
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/calculator-config", {
        method: "PATCH",
        accessToken,
        body,
      }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }

  return { ok: true };
}

/** A labelled field — the rows previously leaned on placeholder text alone. */
function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-xs text-white/50">
        {label}
      </Label>
      {children}
    </div>
  );
}

function RateOptionRows({
  prefix,
  items,
}: {
  prefix: string;
  items: RateOption[];
}) {
  const [rows, setRows] = useState<number[]>(
    items.length > 0 ? items.map((_, i) => i) : [0],
  );

  return (
    <div className="space-y-4">
      {rows.map((key, i) => {
        const field = (name: string) => `${prefix}-${key}-${name}`;
        return (
        <div
          key={key}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/10 pt-4 first:border-0 first:pt-0"
        >
          <Field id={field("id")} label="ID">
            <Input
              id={field("id")}
              name={`${prefix}.id`}
              placeholder="id (e.g. mvp)"
              defaultValue={items[i]?.id ?? ""}
            />
          </Field>
          <Field id={field("title")} label="Title">
            <Input
              id={field("title")}
              name={`${prefix}.title`}
              placeholder="Title"
              defaultValue={items[i]?.title ?? ""}
            />
          </Field>
          <Field id={field("desc")} label="Description" className="sm:col-span-2">
            <Textarea
              id={field("desc")}
              name={`${prefix}.desc`}
              placeholder="Description"
              className="h-16"
              defaultValue={items[i]?.desc ?? ""}
            />
          </Field>
          <Field id={field("weeks")} label="Weeks">
            <Input
              id={field("weeks")}
              name={`${prefix}.weeks`}
              type="number"
              step="0.5"
              placeholder="Weeks"
              defaultValue={items[i]?.weeks ?? 0}
            />
          </Field>
          <Field id={field("costMultiplier")} label="Cost multiplier">
            <div className="flex gap-2">
              <Input
                id={field("costMultiplier")}
                name={`${prefix}.costMultiplier`}
                type="number"
                step="0.01"
                placeholder="Cost multiplier"
                defaultValue={items[i]?.costMultiplier ?? 1}
              />
              {rows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove row ${i + 1}`}
                  onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
                >
                  &times;
                </Button>
              )}
            </div>
          </Field>
        </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setRows((r) => [...r, (r.at(-1) ?? -1) + 1])}
      >
        Add row
      </Button>
    </div>
  );
}

function TimelineSpeedRows({ items }: { items: TimelineSpeed[] }) {
  const [rows, setRows] = useState<number[]>(
    items.length > 0 ? items.map((_, i) => i) : [0],
  );

  return (
    <div className="space-y-4">
      {rows.map((key, i) => {
        const field = (name: string) => `timelineSpeeds-${key}-${name}`;
        return (
        <div
          key={key}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-4 first:border-0 first:pt-0"
        >
          <Field id={field("id")} label="ID">
            <Input
              id={field("id")}
              name="timelineSpeeds.id"
              placeholder="id (e.g. standard)"
              defaultValue={items[i]?.id ?? ""}
            />
          </Field>
          <Field id={field("label")} label="Label">
            <Input
              id={field("label")}
              name="timelineSpeeds.label"
              placeholder="Label"
              defaultValue={items[i]?.label ?? ""}
            />
          </Field>
          <Field id={field("multiplier")} label="Cost multiplier">
            <div className="flex gap-2">
              <Input
                id={field("multiplier")}
                name="timelineSpeeds.multiplier"
                type="number"
                step="0.01"
                placeholder="Cost multiplier"
                defaultValue={items[i]?.multiplier ?? 1}
              />
              {rows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove row ${i + 1}`}
                  onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
                >
                  &times;
                </Button>
              )}
            </div>
          </Field>
          <Field id={field("desc")} label="Description" className="sm:col-span-2">
            <Textarea
              id={field("desc")}
              name="timelineSpeeds.desc"
              placeholder="Description"
              className="h-16"
              defaultValue={items[i]?.desc ?? ""}
            />
          </Field>
          <Field id={field("weeksOffset")} label="Weeks offset">
            <Input
              id={field("weeksOffset")}
              name="timelineSpeeds.weeksOffset"
              type="number"
              step="0.5"
              placeholder="Weeks offset"
              defaultValue={items[i]?.weeksOffset ?? 0}
            />
          </Field>
        </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setRows((r) => [...r, (r.at(-1) ?? -1) + 1])}
      >
        Add row
      </Button>
    </div>
  );
}

export default function AdminCalculatorConfig({
  loaderData,
}: Route.ComponentProps) {
  const { config } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-3xl space-y-8">
      <AdminPageHeader
        title="Calculator Config"
        description="Pricing rates used by the estimate calculator on /calculator."
      />

      <Form method="post" className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseCost">Base cost ($)</Label>
                <Input
                  id="baseCost"
                  name="baseCost"
                  type="number"
                  defaultValue={config.baseCost}
                />
                <p className="text-xs text-white/40">
                  Every multiplier is applied to this figure.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rangeSpreadPct">Range spread</Label>
                <Input
                  id="rangeSpreadPct"
                  name="rangeSpreadPct"
                  type="number"
                  step="0.01"
                  defaultValue={config.rangeSpreadPct}
                />
                <p className="text-xs text-white/40">
                  0.28 quotes a range 28% above the low end.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roundToNearest">Round to nearest ($)</Label>
                <Input
                  id="roundToNearest"
                  name="roundToNearest"
                  type="number"
                  defaultValue={config.roundToNearest}
                />
                <p className="text-xs text-white/40">
                  Both ends snap to this increment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Project Types</CardTitle>
          </CardHeader>
          <CardContent>
            <RateOptionRows prefix="projectTypes" items={config.projectTypes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <RateOptionRows prefix="features" items={config.features} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Timeline Speeds</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineSpeedRows items={config.timelineSpeeds} />
          </CardContent>
        </Card>

        {actionData?.error && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}
        {actionData?.ok && (
          <p className="text-green-400 text-sm">Saved.</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Calculator Config"}
        </Button>
      </Form>
    </div>
  );
}

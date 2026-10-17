import { apiFetch, ApiError } from "./api.server";
import { callAdminApi } from "./session.server";
import { pipelineBodyFromForm } from "./leads";
import type { Organization } from "./types";

/** Backend admin base for a lead source, e.g. "/contact/admin". */
export type LeadApiBase = "/contact/admin" | "/estimates/admin" | "/audits/admin";

/**
 * The pipeline intents shared by the contact and estimate submission pages.
 * Returns undefined for any other intent so the route's own action can
 * handle it.
 */
export async function handleLeadPipelineIntent(
  request: Request,
  formData: FormData,
  apiBase: LeadApiBase,
): Promise<{ ok: true; message?: string } | { error: string } | undefined> {
  const intent = String(formData.get("intent"));
  const id = String(formData.get("id"));

  if (intent === "pipeline") {
    try {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`${apiBase}/${id}/pipeline`, {
          method: "PATCH",
          accessToken,
          body: pipelineBodyFromForm(formData),
        }),
      );
      return { ok: true };
    } catch (err) {
      return toActionError(err);
    }
  }

  if (intent === "convert") {
    return convertToClient(request, formData, apiBase, id);
  }

  return undefined;
}

/**
 * Lead → client in one step: creates the Organization, invites the contact
 * into the portal as its client admin (which sends the invite email), and
 * marks the lead won. Each step needs the previous one, so a failure part way
 * says exactly how far it got rather than leaving the admin to guess.
 */
async function convertToClient(
  request: Request,
  formData: FormData,
  apiBase: LeadApiBase,
  id: string,
) {
  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const email = field("email");

  let org: Organization;
  try {
    org = await callAdminApi(request, (accessToken) =>
      apiFetch<Organization>("/organizations", {
        method: "POST",
        accessToken,
        body: { name: field("organizationName"), billingEmail: email },
      }),
    );
  } catch (err) {
    return toActionError(err, "Couldn't create the organization");
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/users/invite", {
        method: "POST",
        accessToken,
        body: {
          firstName: field("firstName"),
          lastName: field("lastName"),
          email,
          role: "user",
          organization: org._id,
          orgRole: "client_admin",
        },
      }),
    );
  } catch (err) {
    return toActionError(
      err,
      `Organization "${org.name}" was created, but the portal invite failed — invite them from People`,
    );
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`${apiBase}/${id}/pipeline`, {
        method: "PATCH",
        accessToken,
        body: { stage: "won" },
      }),
    );
  } catch (err) {
    return toActionError(
      err,
      "Client created and invited, but the lead couldn't be marked won",
    );
  }

  return {
    ok: true as const,
    message: `${org.name} created and ${email} invited to the portal.`,
  };
}

function toActionError(err: unknown, prefix?: string): { error: string } {
  // A Response is callAdminApi's redirect to login — let it propagate.
  if (err instanceof Response) throw err;
  const detail = err instanceof ApiError ? err.message : "Something went wrong.";
  return { error: prefix ? `${prefix}: ${detail}` : detail };
}

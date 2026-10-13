import { redirect } from "react-router";

/**
 * Contract-sent emails used to link here, but there is no contracts index in
 * the portal — a contract is reviewed on its project's Contract tab (new
 * emails link there directly). Old links land on the portal home, which lists
 * the client's projects.
 */
export function loader() {
  return redirect("/portal");
}

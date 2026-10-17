import { useEffect, useState } from "react";
import { formatTimestamp } from "~/lib/dates";

/**
 * A timestamp in the viewer's own timezone, without a hydration mismatch.
 * The server (UTC) and the first client render both print UTC; once mounted
 * it re-renders in local time. See lib/dates.ts for why.
 */
export function LocalTime({ value, withTime = false }: { value: string; withTime?: boolean }) {
  const [local, setLocal] = useState<string | null>(null);

  useEffect(() => {
    setLocal(formatTimestamp(value, { withTime }));
  }, [value, withTime]);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return (
    <time dateTime={date.toISOString()}>
      {local ?? `${formatTimestamp(value, { withTime, timeZone: "UTC" })}${withTime ? " UTC" : ""}`}
    </time>
  );
}

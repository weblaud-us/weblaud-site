import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheckCircle, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import { Loader2, Monitor, Smartphone } from "lucide-react";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { Turnstile, TurnstileStatus, useTurnstile } from "~/components/ui/turnstile";
import { AuditScoreTiles, AuditVitalsTable } from "./auditScores";
import { AuditClaimForm } from "./auditClaimForm";
import { failureMessage, looksLikeWebsite } from "~/lib/audit";
import { track } from "~/lib/analytics";
import { DISCOVERY_CALL } from "~/lib/constants";
import type { AuditPublicResult, AuditStrategy } from "~/lib/types";

const POLL_MS = 2500;
/** Give up client-side after this; the backend reports lost runs as failed at 3 min. */
const GIVE_UP_MS = 120_000;

/** Shown in turn while Lighthouse runs — roughly how long each phase takes. */
const PROGRESS_STEPS = [
  { after: 0, label: "Loading your page in a real Chrome browser…" },
  { after: 6_000, label: "Measuring Core Web Vitals…" },
  { after: 16_000, label: "Checking SEO and accessibility…" },
  { after: 28_000, label: "Compiling your report…" },
  { after: 45_000, label: "Still working — slow pages take a little longer…" },
];

/**
 * Polls the status route for one audit until it finishes. A fetcher keyed by
 * audit id, so a new run never shows the previous run's result.
 */
function useAuditStatus(id: string | null) {
  const fetcher = useFetcher<AuditPublicResult | { error: string }>({
    key: id ? `audit-${id}` : undefined,
  });
  const startedAt = useRef(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!id) return;
    startedAt.current = Date.now();
    setElapsed(0);
    fetcher.load(`/audit/status/${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const data = fetcher.data;
  const result = data && "runStatus" in data ? data : undefined;
  const error = data && "error" in data ? data.error : undefined;
  const running = !!id && !error && (!result || result.runStatus === "running");
  const timedOut = running && elapsed > GIVE_UP_MS;

  useEffect(() => {
    if (!id || !running || timedOut || fetcher.state !== "idle") return;
    const timer = setTimeout(() => {
      setElapsed(Date.now() - startedAt.current);
      fetcher.load(`/audit/status/${id}`);
    }, POLL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, running, timedOut, fetcher.state, data]);

  return { result, error, running: running && !timedOut, timedOut, elapsed };
}

export function AuditTool() {
  const runFetcher = useFetcher<{ id?: string; error?: string }>();
  const captcha = useTurnstile();
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<AuditStrategy>("mobile");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [claimedEmail, setClaimedEmail] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const status = useAuditStatus(auditId);
  const result = status.result;
  const starting = runFetcher.state !== "idle";

  useEffect(() => {
    if (runFetcher.state !== "idle" || !runFetcher.data) return;
    if (runFetcher.data.id) {
      setAuditId(runFetcher.data.id);
      setClaimedEmail(null);
      track("audit_run", { strategy });
    } else if (runFetcher.data.error) {
      toast.error(runFetcher.data.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runFetcher.state, runFetcher.data]);

  // Bring the finished report into view on small screens.
  useEffect(() => {
    if (result?.runStatus === "done") {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result?.runStatus]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!looksLikeWebsite(url)) {
      setUrlError("Enter your website's address, like example.com");
      return;
    }
    setUrlError(null);
    runFetcher.submit(
      { intent: "run", url: url.trim(), strategy, captchaToken: captcha.token ?? "" },
      { method: "post" },
    );
  };

  const reset = useCallback(() => {
    setAuditId(null);
    setClaimedEmail(null);
  }, []);

  const progressLabel =
    [...PROGRESS_STEPS].reverse().find((s) => status.elapsed >= s.after)?.label ??
    PROGRESS_STEPS[0].label;

  const failed = status.timedOut || !!status.error || result?.runStatus === "failed";
  const busy = starting || status.running;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* URL form — stays visible so a second site is one edit away. */}
      <form
        onSubmit={onSubmit}
        className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl"
        noValidate
      >
        <label htmlFor="audit-url" className="block text-xs font-mono uppercase tracking-wider text-gray-400 font-medium mb-2">
          Your website
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
            <input
              id="audit-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-invalid={urlError ? true : undefined}
              aria-describedby={urlError ? "audit-url-error" : undefined}
              disabled={busy}
              className={`w-full h-12 bg-black/60 border ${
                urlError ? "border-red-500/80" : "border-white/[0.08] focus:border-primary/60"
              } rounded-xl pl-10 pr-4 text-white font-barlow text-base placeholder:text-gray-600 outline-none transition-colors disabled:opacity-60`}
            />
          </div>
          <div className="flex rounded-xl border border-white/[0.08] bg-black/60 p-1 shrink-0" role="radiogroup" aria-label="Device">
            {(
              [
                { value: "mobile", label: "Mobile", icon: Smartphone },
                { value: "desktop", label: "Desktop", icon: Monitor },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={strategy === value}
                disabled={busy}
                onClick={() => setStrategy(value)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 h-10 rounded-lg text-sm font-barlow transition-colors ${
                  strategy === value ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={busy || !captcha.ready}
            className="h-12 inline-flex items-center justify-center gap-2 bg-primary-solid hover:bg-primary-solid-hover text-white font-barlow font-semibold text-sm px-6 rounded-xl transition-colors shadow-md shadow-blue-500/25 cursor-pointer disabled:opacity-60 disabled:pointer-events-none shrink-0"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? "Auditing…" : "Run free audit"}
          </button>
        </div>
        {urlError && (
          <p id="audit-url-error" className="mt-2 text-red-400 text-xs font-barlow">
            {urlError}
          </p>
        )}
        <Turnstile
          siteKey={captcha.siteKey}
          onToken={captcha.onToken}
          onError={captcha.onError}
          resetKey={runFetcher.data}
          action="audit-run"
          className="mt-3"
        />
        <TurnstileStatus {...captcha} />
      </form>

      <div ref={resultRef} className="scroll-mt-28" aria-live="polite">
        <AnimatePresence mode="wait">
          {auditId && status.running && (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 sm:p-8 text-center"
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" aria-hidden="true" />
              <p className="mt-4 text-white font-barlow font-semibold">{progressLabel}</p>
              <p className="mt-1 text-xs text-gray-500 font-barlow">
                Google runs Lighthouse on your page — this usually takes 20–40 seconds.
              </p>
            </motion.div>
          )}

          {auditId && failed && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5 sm:p-6"
              role="alert"
            >
              <p className="flex items-start gap-2.5 text-sm text-white font-barlow">
                <FiAlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                {status.timedOut ? failureMessage("timeout") : status.error ?? failureMessage(result?.failureReason)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-barlow text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full cursor-pointer">
                  <FiRefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Try again
                </button>
                <button type="button" onClick={() => setBookingOpen(true)} className="text-sm font-barlow text-primary hover:text-blue-400 px-2 py-2 cursor-pointer">
                  Book a call instead
                </button>
              </div>
            </motion.div>
          )}

          {result?.runStatus === "done" && result.scores && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-barlow text-white">
                  Results for <span className="text-primary break-all">{result.host}</span>
                </h2>
                <span className="text-xs text-gray-500 font-barlow">
                  {result.strategy === "desktop" ? "Desktop" : "Mobile"} · Google Lighthouse lab test
                </span>
              </div>

              <AuditScoreTiles scores={result.scores} />
              <AuditVitalsTable vitals={result.vitals} />

              {result.issueCount > 0 && (
                <p className="text-sm text-gray-300 font-barlow">
                  We found{" "}
                  <strong className="text-white">
                    {result.issueCount} issue{result.issueCount === 1 ? "" : "s"}
                  </strong>{" "}
                  holding this page back.
                </p>
              )}

              {claimedEmail ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 sm:p-6" role="status">
                  <p className="flex items-center gap-2 text-white font-barlow font-semibold">
                    <FiCheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    Report sent to {claimedEmail}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-400 font-barlow">
                    Check your inbox in a minute. Want to go through it together? A{" "}
                    {DISCOVERY_CALL.label} call is the fastest way to a fix plan.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 bg-primary-solid hover:bg-primary-solid-hover text-white font-barlow font-semibold text-sm px-5 py-2.5 rounded-full cursor-pointer"
                  >
                    Book a free call
                  </button>
                </div>
              ) : result.claimed ? null : (
                <AuditClaimForm
                  auditId={result.id}
                  issueCount={result.issueCount}
                  onClaimed={setClaimedEmail}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

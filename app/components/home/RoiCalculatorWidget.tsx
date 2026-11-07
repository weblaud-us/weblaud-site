import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { ROI } from "~/data/home-content";
import { AUTOMATION, PRICING } from "~/lib/constants";
import { RoiCta } from "./roiCta";

const WEEKS_PER_YEAR = 52;
/** Past this, payback is reported as a floor rather than a precise month count. */
const PAYBACK_CAP_MONTHS = 24;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const count = new Intl.NumberFormat("en-US");

/** One labelled slider. The value doubles as the input's aria-valuetext so the
 *  unit ("8 people", not a bare "8") is announced with the number. */
function SliderRow({ label, display, value, min, max, step = 1, onChange }: {
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-barlow text-sm font-medium text-white">
          {label}
        </label>
        <span aria-hidden="true" className="shrink-0 font-mono text-sm font-semibold text-primary">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full cursor-pointer accent-[#0066FF]"
      />
    </div>
  );
}

/** Interactive ROI estimate: three inputs a non-technical owner can answer from
 *  memory, against the hours and payroll a build gives back. */
const RoiCalculatorWidget = () => {
  const [teamSize, setTeamSize] = useState(8);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [cardRef, isCardVisible] = useBlurAnimation<HTMLDivElement>();

  const hoursSaved = Math.round(teamSize * hoursPerWeek * WEEKS_PER_YEAR * AUTOMATION.share);
  const annualSavings = hoursSaved * hourlyCost;
  // Payback is quoted against the published sprint-fee range rather than an
  // invented project price, so the widget cannot drift from PRICING. The slider
  // minimums keep monthlySavings above zero.
  const monthlySavings = annualSavings / 12;
  const fastest = Math.max(1, Math.ceil(PRICING.min / monthlySavings));
  const slowest = Math.max(1, Math.ceil(PRICING.max / monthlySavings));
  const payback =
    fastest > PAYBACK_CAP_MONTHS
      ? `${PAYBACK_CAP_MONTHS}+ mos`
      : slowest > PAYBACK_CAP_MONTHS
        ? `${fastest}–${PAYBACK_CAP_MONTHS}+ mos`
        : fastest === slowest
          ? `${fastest} mos`
          : `${fastest}–${slowest} mos`;

  return (
    <section
      id="roi"
      aria-labelledby="roi-title"
      className="scroll-mt-24 bg-black px-4 md:px-6 py-16 sm:py-20 md:py-24"
    >
      <div
        ref={cardRef}
        className={`mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[var(--bg-surface,#12151A)] p-8 sm:p-12 ${getBlurAnimationClasses(isCardVisible)}`}
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <SectionBadge
              icon={<Calculator className="w-3.5 h-3.5" />}
              text={ROI.badge}
              badgeLabel={ROI.badgeLabel}
              color="#0a84ff"
              className="mb-4"
            />
            <h2
              id="roi-title"
              className="text-white font-barlow text-2xl md:text-4xl font-bold tracking-tight text-balance"
            >
              {ROI.heading}
            </h2>
            <p className="mt-4 mb-8 max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed">{ROI.subheading}</p>

            <div className="space-y-6">
              <SliderRow
                label={ROI.fields.teamSize}
                display={`${teamSize} ${teamSize === 1 ? "person" : "people"}`}
                value={teamSize}
                min={1}
                max={50}
                onChange={setTeamSize}
              />
              <SliderRow
                label={ROI.fields.hoursPerWeek}
                display={`${hoursPerWeek} hrs / week`}
                value={hoursPerWeek}
                min={2}
                max={30}
                onChange={setHoursPerWeek}
              />
              <SliderRow
                label={ROI.fields.hourlyCost}
                display={`${usd.format(hourlyCost)} / hr`}
                value={hourlyCost}
                min={15}
                max={100}
                step={5}
                onChange={setHourlyCost}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#0066FF]/30 bg-gradient-to-br from-[#0066FF]/15 to-transparent p-6 sm:p-8">
            <div aria-live="polite" className="space-y-6">
              <div>
                <p className="font-mono text-xs tracking-[0.08em] text-gray-400">{ROI.results.savings}</p>
                <motion.p
                  key={annualSavings}
                  initial={{ scale: 0.96, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 font-barlow text-4xl font-bold tracking-tight text-primary sm:text-5xl"
                >
                  {usd.format(annualSavings)}
                  <span className="text-lg font-normal text-gray-400">/yr</span>
                </motion.p>
              </div>

              <dl className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <dt className="text-xs text-gray-400">{ROI.results.hours}</dt>
                  <dd className="mt-1 font-barlow text-2xl font-bold text-white">{count.format(hoursSaved)} hrs</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">{ROI.results.payback}</dt>
                  <dd className="mt-1 font-barlow text-2xl font-bold text-emerald-400">{payback}</dd>
                </div>
              </dl>
            </div>

            <RoiCta to="/calculator" className="mt-8 w-full">
              {ROI.cta}
            </RoiCta>

            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              An estimate, not a quote. Assumes automation removes {AUTOMATION.percentLabel} of the repetitive hours
              you enter above, with payback measured against our published {PRICING.range} fixed sprint fee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiCalculatorWidget;

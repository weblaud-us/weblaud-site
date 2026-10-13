import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Eraser } from "lucide-react";

/**
 * Minimal draw-to-sign canvas. Writes the drawn signature into a hidden
 * input (`name`) as a PNG data URL on every stroke, so it submits with the
 * surrounding <form> like any other field — the backend accepts it exactly
 * as-is (ContractAcceptance.signatureImage) and embeds it in the acceptance
 * certificate PDF. Entirely optional: the typed legal name is the real
 * e-signature for v1, this is just a nicer touch when someone wants it.
 */
export function SignaturePad({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [dataUrl, setDataUrl] = useState("");

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  }

  function stop() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) setDataUrl(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setDataUrl("");
  }

  return (
    <div className="space-y-1.5">
      <canvas
        ref={canvasRef}
        width={400}
        height={120}
        onPointerDown={start}
        onPointerMove={draw}
        onPointerUp={stop}
        onPointerLeave={stop}
        className="w-full max-w-[400px] h-[120px] rounded-lg border border-white/15 bg-black/40 touch-none cursor-crosshair"
      />
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/40">Optional — draw your signature above</p>
        {hasDrawn && (
          <Button type="button" variant="ghost" size="sm" onClick={clear}>
            <Eraser className="size-3.5" />
            Clear
          </Button>
        )}
      </div>
      <input type="hidden" name={name} value={dataUrl} />
    </div>
  );
}

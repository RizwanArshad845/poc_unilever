import { useEffect, useRef, useState } from 'react';

const REVEAL_AT = 0.5; // fraction of foil cleared before auto-reveal
const BRUSH = 26;

function paintFoil(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#A9823F');
  g.addColorStop(0.35, '#F3E0AE');
  g.addColorStop(0.55, '#C9A15A');
  g.addColorStop(0.8, '#F6E7C1');
  g.addColorStop(1, '#9C7638');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // fine brushed-metal grain
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#5B3E12';
  for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgba(58, 15, 63, 0.75)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic 600 ${Math.round(h * 0.16)}px "Bodoni Moda", Georgia, serif`;
  ctx.fillText('Scratch here', w / 2, h / 2 - h * 0.06);
  ctx.font = `400 ${Math.round(h * 0.075)}px Outfit, sans-serif`;
  ctx.fillText('with your finger or mouse', w / 2, h / 2 + h * 0.12);
}

export default function ScratchCard({ children, onReveal }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const strokes = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const { width, height } = wrapRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const paint = () => paintFoil(ctx, width, height);
    paint();
    document.fonts?.ready.then(paint); // repaint once Bodoni has loaded
  }, []);

  function reveal() {
    if (revealed) return;
    setRevealed(true);
    onReveal?.();
  }

  function clearedFraction() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++;
      if (data[i] === 0) clear++;
    }
    return clear / total;
  }

  function point(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function scratch(e) {
    if (!drawing.current || revealed) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = point(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = BRUSH * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current?.x ?? p.x, last.current?.y ?? p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (++strokes.current % 8 === 0 && clearedFraction() > REVEAL_AT) reveal();
  }

  return (
    <div className="scratch" ref={wrapRef}>
      <div className="scratch__prize">{children}</div>
      <canvas
        ref={canvasRef}
        className={`scratch__foil ${revealed ? 'is-gone' : ''}`}
        aria-hidden="true"
        onPointerDown={(e) => {
          drawing.current = true;
          last.current = null;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={scratch}
        onPointerUp={() => {
          drawing.current = false;
          if (clearedFraction() > REVEAL_AT) reveal();
        }}
      />
      {!revealed && (
        <button type="button" className="scratch__skip" onClick={reveal}>
          Reveal prize
        </button>
      )}
    </div>
  );
}

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Check, Copy, ImageUp, RefreshCw, SwitchCamera, X } from 'lucide-react';
import Header from '../components/Header.jsx';
import Camera from '../components/Camera.jsx';
import ScratchCard from '../components/ScratchCard.jsx';
import { fileToPayload, scanImage } from '../lib/image.js';

const COLORS = ['#E4C88E', '#F6D3DF', '#B14F8E', '#FFF7F3'];

function celebrate(big) {
  const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 50 };
  confetti({ ...base, particleCount: big ? 160 : 60, spread: big ? 100 : 60, startVelocity: big ? 45 : 30, origin: { y: 0.6 } });
  if (big) {
    setTimeout(() => confetti({ ...base, particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } }), 200);
    setTimeout(() => confetti({ ...base, particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }), 200);
  }
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
};

export default function Scan() {
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  // stage: 'aim' | 'checking' | 'won' | 'rejected' | 'error'
  const [stage, setStage] = useState('aim');
  const [facing, setFacing] = useState('environment');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit(payload) {
    setPhoto(payload.dataUrl);
    setStage('checking');
    try {
      const data = await scanImage(payload);
      setResult(data);
      setStage(data.won ? 'won' : 'rejected');
      if (data.won) celebrate(false);
    } catch (err) {
      setError(err.message);
      setStage('error');
    }
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      await submit(await fileToPayload(file));
    } catch {
      setError('We could not open that file. Choose a JPEG or PNG photo.');
      setStage('error');
    }
  }

  function reset() {
    setStage('aim');
    setPhoto(null);
    setResult(null);
    setError('');
    setRevealed(false);
    setCopied(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(result.prize.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; code stays visible to copy by hand */
    }
  }

  const showCamera = stage === 'aim' && !cameraError;

  return (
    <div className="scan">
      <Header>
        <Link to="/" className="back">
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Link>
      </Header>

      <main className="scan__main">
        <AnimatePresence mode="wait">
          <motion.div key={stage} className="scan__heading" {...fade}>
            {stage === 'aim' && (
              <>
                <h1>Photograph your bottle</h1>
                <p>Fit the whole bottle inside the arch with the Lux label facing you.</p>
              </>
            )}
            {stage === 'checking' && (
              <>
                <h1>Checking your bottle</h1>
                <p>Reading the label and pack shape.</p>
              </>
            )}
            {stage === 'won' && (
              <>
                <h1>It's genuine Lux</h1>
                <p>{result.message}</p>
              </>
            )}
            {stage === 'rejected' && (
              <>
                <h1>That's not quite it</h1>
                <p>{result.message}</p>
              </>
            )}
            {stage === 'error' && (
              <>
                <h1>Something got in the way</h1>
                <p>{error}</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {stage !== 'won' && (
          <div className={`viewfinder ${stage === 'checking' ? 'is-checking' : ''}`}>
            {showCamera ? (
              <Camera
                ref={cameraRef}
                facing={facing}
                onReady={() => setCameraReady(true)}
                onUnavailable={setCameraError}
              />
            ) : photo ? (
              <img src={photo} alt="Your photo" className="viewfinder__photo" />
            ) : (
              <div className="viewfinder__empty">
                <ImageUp size={36} aria-hidden="true" />
                <p>{cameraError}</p>
              </div>
            )}
            <span className="viewfinder__frame" aria-hidden="true" />
            {stage === 'checking' && <span className="viewfinder__scanline" aria-hidden="true" />}
            {stage === 'rejected' && (
              <span className="viewfinder__stamp" aria-hidden="true">
                <X size={28} />
              </span>
            )}
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />

        {stage === 'aim' && (
          <div className="controls">
            <button type="button" className="icon-btn" onClick={() => fileRef.current.click()} aria-label="Upload a photo">
              <ImageUp size={22} />
            </button>
            {showCamera ? (
              <button
                type="button"
                className="shutter"
                disabled={!cameraReady}
                onClick={() => submit(cameraRef.current.capture())}
                aria-label="Take photo"
              />
            ) : (
              <button type="button" className="btn btn--gold" onClick={() => fileRef.current.click()}>
                Upload a photo
              </button>
            )}
            <button
              type="button"
              className="icon-btn"
              disabled={!showCamera}
              onClick={() => {
                setCameraReady(false);
                setFacing((f) => (f === 'environment' ? 'user' : 'environment'));
              }}
              aria-label="Switch camera"
            >
              <SwitchCamera size={22} />
            </button>
          </div>
        )}

        {stage === 'checking' && (
          <p className="checking" role="status">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            Usually takes a few seconds
          </p>
        )}

        {(stage === 'rejected' || stage === 'error') && (
          <motion.div className="retry" {...fade}>
            {result?.cues?.length > 0 && <Cues cues={result.cues} />}
            <button type="button" className="btn btn--gold" onClick={reset}>
              <RefreshCw size={18} aria-hidden="true" />
              Retake photo
            </button>
          </motion.div>
        )}

        {stage === 'won' && (
          <motion.div className="win" {...fade}>
            <div className="verified">
              <img src={photo} alt="" className="verified__thumb" />
              <div>
                <p className="verified__label">
                  <Check size={16} aria-hidden="true" /> Verified product
                </p>
                <p className="verified__name">{result.product_name || 'Lux shower gel'}</p>
                <Confidence value={result.confidence} />
              </div>
            </div>
            <Cues cues={result.cues} />

            <ScratchCard
              onReveal={() => {
                setRevealed(true);
                celebrate(true);
              }}
            >
              <p className="prize__kicker">You won</p>
              <p className="prize__title">{result.prize.title}</p>
              <p className="prize__detail">{result.prize.detail}</p>
            </ScratchCard>

            <AnimatePresence>
              {revealed && (
                <motion.div className="claim" {...fade}>
                  <p>Show this code at checkout or enter it online.</p>
                  <button type="button" className="code" onClick={copyCode}>
                    <span>{result.prize.code}</span>
                    {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                    <span className="sr-only">{copied ? 'Copied' : 'Copy code'}</span>
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={reset}>
                    Scan another bottle
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function Cues({ cues }) {
  return (
    <div className="cues">
      <p className="cues__title">What we saw</p>
      <ul>
        {cues.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

function Confidence({ value }) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <div className="confidence" aria-label={`Match confidence ${pct}%`}>
      <span className="confidence__bar">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
      <span className="confidence__pct">{pct}% match</span>
    </div>
  );
}

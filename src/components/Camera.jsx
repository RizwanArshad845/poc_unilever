import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { captureVideoFrame } from '../lib/image.js';

/**
 * Live rear-camera viewfinder. Exposes `capture()` via ref.
 * Calls onUnavailable() when the browser blocks or lacks a camera, so the page can fall back to upload.
 */
const Camera = forwardRef(function Camera({ facing, onReady, onUnavailable }, ref) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    capture: () => captureVideoFrame(videoRef.current),
  }));

  useEffect(() => {
    let stream;
    let cancelled = false;
    setReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      onUnavailable?.('This browser cannot open the camera.');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        const video = videoRef.current;
        video.srcObject = s;
        return video.play();
      })
      .catch((err) => {
        if (cancelled) return;
        onUnavailable?.(
          err?.name === 'NotAllowedError'
            ? 'Camera access is blocked. Allow it in your browser settings, or upload a photo instead.'
            : 'We could not open your camera. Upload a photo instead.',
        );
      });

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing]);

  return (
    <video
      ref={videoRef}
      className={`camera ${ready ? 'is-ready' : ''} ${facing === 'user' ? 'is-mirrored' : ''}`}
      playsInline
      muted
      onLoadedData={() => {
        setReady(true);
        onReady?.();
      }}
    />
  );
});

export default Camera;

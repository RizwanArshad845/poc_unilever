const MAX_EDGE = 1280;
const QUALITY = 0.85;

function toPayload(source, width, height) {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
  return { dataUrl, image: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
}

/** Grab the current frame of a playing <video> as a compressed JPEG payload. */
export function captureVideoFrame(video) {
  return toPayload(video, video.videoWidth, video.videoHeight);
}

/** Decode a picked file (respecting EXIF rotation) and compress it. */
export async function fileToPayload(file) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    try {
      return toPayload(bitmap, bitmap.width, bitmap.height);
    } finally {
      bitmap.close();
    }
  } catch {
    // Older iOS Safari lacks createImageBitmap options; <img> also applies EXIF rotation.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return toPayload(img, img.naturalWidth, img.naturalHeight);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

export async function scanImage({ image, mimeType }) {
  const res = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, mimeType }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'We could not check your photo. Try again.');
  return data;
}

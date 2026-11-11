import { applyWatermark, compressImage } from './watermark';

/**
 * Vercel Blob storage client.
 * Uploads photos, attachments, videos, and documents directly to Vercel Blob via /api/upload.
 */
export async function uploadToBlob(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn('Vercel Blob upload endpoint response:', errData);
    }
  } catch (err) {
    console.warn('Vercel Blob upload network error, falling back to FileReader:', err);
  }

  // Resilient fallback to local Data URL if server is in offline dev mode without blob token
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload video file (MP4, WebM, MOV) directly to Vercel Blob.
 */
export async function uploadVideoToBlob(file: File): Promise<string> {
  return uploadToBlob(file);
}

/**
 * Upload document or attachment (PDF, memorial, planta baixa) to Vercel Blob.
 */
export async function uploadDocumentToBlob(file: File): Promise<string> {
  return uploadToBlob(file);
}

/**
 * Upload image with automatic lossless-compression and official golden logo watermark.
 */
export async function uploadImage(
  file: File,
  logoUrl?: string,
  autoWatermark: boolean = false
): Promise<string> {
  let fileToUpload = file;

  if (file.type.startsWith('image/')) {
    try {
      if (autoWatermark) {
        fileToUpload = await applyWatermark(file, logoUrl);
      } else {
        fileToUpload = await compressImage(file);
      }
    } catch (wmError) {
      console.warn('Watermark/compression notice (uploading original):', wmError);
      fileToUpload = file;
    }
  }

  return uploadToBlob(fileToUpload);
}

/**
 * Upload multiple files to Vercel Blob with automatic compression and watermark on images.
 */
export async function uploadMultipleImages(
  files: File[],
  logoUrl?: string,
  autoWatermark: boolean = true,
  onProgress?: (index: number, total: number, message: string) => void
): Promise<string[]> {
  const urls: string[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    const label = isVideo
      ? `Enviando vídeo ${i + 1} de ${total} para Vercel Blob...`
      : isImage
      ? `Otimizando e aplicando marca d'água oficial na foto ${i + 1} de ${total}...`
      : `Enviando arquivo ${i + 1} de ${total}...`;

    if (onProgress) onProgress(i, total, label);

    const url = isVideo
      ? await uploadVideoToBlob(file)
      : await uploadImage(file, logoUrl, autoWatermark);

    urls.push(url);

    if (onProgress) onProgress(i + 1, total, `${i + 1} de ${total} concluídos`);
  }

  return urls;
}

import { applyWatermark } from './watermark';

/**
 * Vercel Blob storage client.
 * Uploads photos, attachments, PDFs, and documents directly to Vercel Blob via /api/upload.
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
 * Upload image with optional automatic official logo watermark.
 */
export async function uploadImage(
  file: File,
  logoUrl?: string,
  autoWatermark: boolean = false
): Promise<string> {
  let fileToUpload = file;

  if (autoWatermark && file.type.startsWith('image/')) {
    try {
      fileToUpload = await applyWatermark(file, logoUrl);
    } catch (wmError) {
      console.warn('Watermark generation notice (uploading original):', wmError);
      fileToUpload = file;
    }
  }

  return uploadToBlob(fileToUpload);
}

/**
 * Upload multiple files to Vercel Blob with automatic watermark on images.
 */
export async function uploadMultipleImages(
  files: File[],
  logoUrl?: string,
  autoWatermark: boolean = true,
  onProgress?: (index: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = await uploadImage(file, logoUrl, autoWatermark);
    urls.push(url);
    if (onProgress) onProgress(i + 1, files.length);
  }
  return urls;
}

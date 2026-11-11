/**
 * High-precision luxury watermark utility for real estate photos.
 * Stamps the official golden skyline logo and discreet branding on photos.
 */

export interface WatermarkOptions {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'center';
  opacity?: number;
  scale?: number; // percentage of image width, e.g. 0.22 (22%)
  includeText?: boolean;
  maxDimension?: number; // Max width or height (e.g. 2560 for 4K/retina)
  quality?: number; // 0.88 visually lossless compression
}

/**
 * Compresses an image to the smallest possible size without perceptible loss of quality,
 * and stamps the official golden luxury logo as watermark.
 */
export async function applyWatermark(
  imageSource: File | Blob | string,
  logoUrl: string = 'https://i.postimg.cc/RhPjD53T/Logo-Imobiliario-Dourado-Luxuoso.png',
  options: WatermarkOptions = {}
): Promise<File> {
  const {
    position = 'bottom-right',
    opacity = 0.88,
    scale = 0.22,
    includeText = true,
    maxDimension = 2560,
    quality = 0.88,
  } = options;

  return new Promise((resolve, reject) => {
    // 1. Load base image
    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';

    let objectUrlToRevoke: string | null = null;
    if (typeof imageSource === 'string') {
      baseImg.src = imageSource;
    } else {
      objectUrlToRevoke = URL.createObjectURL(imageSource);
      baseImg.src = objectUrlToRevoke;
    }

    baseImg.onload = async () => {
      try {
        const origWidth = baseImg.naturalWidth || baseImg.width;
        const origHeight = baseImg.naturalHeight || baseImg.height;

        // Calculate optimal dimensions with smart downscaling
        let targetWidth = origWidth;
        let targetHeight = origHeight;

        if (origWidth > maxDimension || origHeight > maxDimension) {
          if (origWidth >= origHeight) {
            targetWidth = maxDimension;
            targetHeight = Math.round((origHeight / origWidth) * maxDimension);
          } else {
            targetHeight = maxDimension;
            targetWidth = Math.round((origWidth / origHeight) * maxDimension);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        // Enable high-quality bicubic smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw photo at target resolution
        ctx.drawImage(baseImg, 0, 0, targetWidth, targetHeight);

        // 2. Load Logo (try direct, if CORS fails, use proxy or fallback)
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';

        await new Promise<void>((resolveLogo) => {
          logoImg.onload = () => resolveLogo();
          logoImg.onerror = () => {
            // Try via proxy endpoint
            logoImg.src = `/api/proxy-image?url=${encodeURIComponent(logoUrl)}`;
            logoImg.onload = () => resolveLogo();
            logoImg.onerror = () => {
              // Proceed without breaking if logo image host is unreachable
              resolveLogo();
            };
          };
          logoImg.src = logoUrl;
        });

        // 3. Draw Watermark if logo loaded successfully
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.save();
          ctx.globalAlpha = opacity;

          // Compute size relative to canvas
          const targetLogoWidth = Math.max(160, Math.min(canvas.width * scale, 420));
          const logoAspect = (logoImg.naturalHeight || 1) / (logoImg.naturalWidth || 1);
          const targetLogoHeight = targetLogoWidth * logoAspect;

          const margin = Math.max(24, Math.round(canvas.width * 0.025));

          let x = canvas.width - targetLogoWidth - margin;
          let y = canvas.height - targetLogoHeight - margin;

          if (position === 'bottom-left') {
            x = margin;
            y = canvas.height - targetLogoHeight - margin;
          } else if (position === 'top-right') {
            x = canvas.width - targetLogoWidth - margin;
            y = margin;
          } else if (position === 'center') {
            x = (canvas.width - targetLogoWidth) / 2;
            y = (canvas.height - targetLogoHeight) / 2;
          }

          // Subtle protective background plate for contrast
          ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          ctx.drawImage(logoImg, x, y, targetLogoWidth, targetLogoHeight);

          // Subtle signature text
          if (includeText) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.shadowBlur = 6;
            ctx.fillStyle = '#fef3c7'; // warm amber gold
            const fontSize = Math.max(11, Math.round(targetLogoWidth * 0.075));
            ctx.font = `600 ${fontSize}px "Cinzel", Georgia, serif`;
            ctx.textAlign = 'right';
            ctx.fillText(
              '@imoveiscomsavio • Exclusividade',
              x + targetLogoWidth,
              y + targetLogoHeight + fontSize + 4
            );
          }

          ctx.restore();
        }

        // Export as High-Quality Optimized JPEG/WebP File
        canvas.toBlob(
          (blob) => {
            if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);

            if (!blob) {
              reject(new Error('Failed to generate watermarked blob'));
              return;
            }

            const originalName =
              imageSource instanceof File
                ? imageSource.name
                : `photo-${Date.now()}.jpg`;
            const cleanName = originalName.replace(/\.[^/.]+$/, '') + '-watermarked.jpg';

            const watermarkedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(watermarkedFile);
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
        reject(err);
      }
    };

    baseImg.onerror = () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      reject(new Error('Failed to load base image for watermarking'));
    };
  });
}

/**
 * Standalone image compression without watermark.
 */
export async function compressImage(
  imageSource: File | Blob | string,
  maxDimension: number = 2560,
  quality: number = 0.88
): Promise<File> {
  return applyWatermark(imageSource, '', {
    scale: 0,
    opacity: 0,
    includeText: false,
    maxDimension,
    quality,
  });
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Area } from "react-easy-crop";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
  });

/**
 * This function takes the original image and the pixel crop coordinates
 * and returns a high-quality base64 string.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Use the natural dimensions for maximum resolution
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // PNG is lossless; 1.0 ensures the highest quality compression
  return canvas.toDataURL('image/png', 1.0);
}

// src/lib/utils.ts

/**
 * Resizes and compresses a base64 image string.
 * @param base64Str The original base64 string
 * @param maxWidth Max width of the resulting image
 * @param quality Quality from 0 to 1 (0.7 is usually the "sweet spot" for size/clarity)
 */
export async function compressImage(
  base64Str: string, 
  maxWidth: number = 800, 
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Canvas context failed"));
      ctx.drawImage(img, 0, 0, width, height);
      // Convert to jpeg to ensure compression (png doesn't support quality param as effectively)
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = (err) => reject(err);
  });
}
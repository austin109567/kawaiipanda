export async function mergeImages(images: string[]): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Load and draw each image in order
  for (const src of images) {
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }

  return canvas.toDataURL('image/png', 1.0);
}
/**
 * Utility to process, compress and convert an uploaded file from PC into a high-quality,
 * lightweight Base64 Data URL suitable for Firestore storage and immediate rendering.
 */
export async function processAndCompressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.82
): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Die ausgewählte Datei ist kein gültiges Bild.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while scaling down if larger than maximum bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas-Kontext konnte nicht initialisiert werden.'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        resolve({ dataUrl: compressedDataUrl, sizeKb });
      };

      img.onerror = () => {
        reject(new Error('Das Bild konnte nicht geladen werden.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei vom PC.'));
    };

    reader.readAsDataURL(file);
  });
}

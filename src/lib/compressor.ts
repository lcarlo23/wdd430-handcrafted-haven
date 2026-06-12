export async function compressImageToLimit(
  file: File,
  maxSizeBytes: number = 1048576
): Promise<File> {
  // if the file is already under the target file limit, return it unmodified
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // downscale the image dimensions if the original file size is significantly larger than the target limit, to improve compression efficiency
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas compilation context error'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        // iteratively reduce the image quality until the resulting file size is under the target limit or a minimum quality threshold is reached
        let quality = 0.9;
        const stepDown = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Canvas image blob generation failure'));
              }
              if (blob.size <= maxSizeBytes || quality <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                quality -= 0.1;
                stepDown();
              }
            },
            'image/jpeg',
            quality
          );
        };
        stepDown();
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

export function SafeImage({ 
  src, 
  alt, 
  className, 
  width, 
  height,
  fallbackSrc = "https://via.placeholder.com/800x400/e2e8f0/1e293b?text=ภาพไม่พร้อมใช้งาน" 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${src}`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // For regular img tag
  if (!width || !height) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
      />
    );
  }

  // For Next.js Image component
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
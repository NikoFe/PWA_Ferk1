import React, { useRef, useEffect, useState } from 'react';

export default function LazyImage({ src, alt,height,width }) {
  const imgRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          console.log("IMAGE LOADED!")
          observer.disconnect(); // stop observing once loaded
        }
      },
      {
        rootMargin: '-0px',
        threshold: 0.7,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={imgRef}
      style={{ minHeight: height, background: '#eee' }}
    >
      {isVisible && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}

        />
      )}
    </div>
  );
}

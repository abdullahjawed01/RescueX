import { useEffect } from 'react';

const useAccidentDetection = (onDetected) => {
  useEffect(() => {
    const threshold = 15.0; // G-force threshold for simulated impact
    
    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      
      if (acceleration > threshold) {
        onDetected({ acceleration: acceleration.toFixed(2), timestamp: new Date() });
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [onDetected]);
};

export default useAccidentDetection;

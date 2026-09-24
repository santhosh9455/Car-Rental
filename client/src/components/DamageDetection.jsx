import React, { useState } from 'react';

const DamageDetection = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-white rounded shadow-xl w-full overflow-hidden mt-8 p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Car Damage Detection AI</h2>
      <p className="text-gray-600 mb-4 text-sm">Upload an image below to detect scratches, dents, and other damage.</p>
      
      <div className="w-full flex justify-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative min-h-[800px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        )}
        <iframe
          src="https://umerforsure-car-damage-detection.hf.space"
          frameBorder="0"
          width="100%"
          height="800"
          title="Car Damage Detection"
          className="w-full h-[800px]"
          onLoad={() => setLoading(false)}
        ></iframe>
      </div>
    </div>
  );
};

export default DamageDetection;

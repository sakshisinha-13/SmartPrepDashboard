import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrepLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1F1F1F] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent leading-relaxed">
          Prepare Smart. Win Big.
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Curated OA + Interview Questions from top companies like Google, Amazon, Atlassian & more.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="px-8 py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full text-lg font-semibold shadow-lg hover:scale-105 transform transition"
        >
          Start Preparing Now
        </button>

      </div>
    </div>
  );
}
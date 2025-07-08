export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full text-center animate-fade-in-up">
      <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <div className="text-lg font-medium text-gray-700 mb-2">Loading products...</div>
      <div className="text-sm text-gray-500 max-w-xs">
        If this is your first visit in a while, the backend server may be waking up (Render free tier sleep feature). This can take up to 30 seconds.
      </div>
    </div>
  );
} 
export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-4 medical-card bg-white border-2 border-black rounded-2xl">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span className="text-black text-sm font-inter ml-2 opacity-80">AI is thinking...</span>
    </div>
  );
}


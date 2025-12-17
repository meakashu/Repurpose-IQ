export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-4 glass-card rounded-2xl">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="text-white/80 text-sm font-inter ml-2">AI is thinking...</span>
    </div>
  );
}


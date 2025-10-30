import { useEffect, useState } from "react";

const TypingTitle = () => {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Media Verse";

  useEffect(() => {
    let index = 0;

    const typing = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;

      // when typing finishes, hide the cursor after a short delay
      if (index > fullText.length) {
        clearInterval(typing);
        setTimeout(() => setShowCursor(false), 500);
      }
    }, 150);

    return () => clearInterval(typing);
  }, []);

  return (
    <h2
      className="text-3xl sm:text-4xl text-blue-600 text-center"
      style={{
        fontWeight: 600,
        fontFamily: "var(--font-montserrat)",
        whiteSpace: "nowrap",
        width: "fit-content",
        margin: "0 auto",
        overflow: "hidden",
        borderRight: showCursor ? "3px solid #2563eb" : "none",
        animation: showCursor ? "blink 0.75s step-end infinite" : "none",
      }}
    >
      {text}
      <style>
        {`
          @keyframes blink {
            50% {
              border-color: transparent;
            }
          }
        `}
      </style>
    </h2>
  );
};

export default TypingTitle;

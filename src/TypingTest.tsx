import { generate } from "random-words";
import { useEffect, useState, useRef } from "react";

const TypingTest: React.FC = () => {
  const [text, setText] = useState<string>(""); // Text that user has to type
  const [userText, setUserText] = useState<string>(""); // Text that the user types
  const [speed, setSpeed] = useState<number>(0); // WPM
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false); // Flag to check if test started
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false); // Flag to check if test is completed

  const startTimeRef = useRef<number>(0); // Reference to track start time
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference

  const autoWordGenerator = (num: number) => {
    const randomWords = generate(num) as string[];
    const wordString = randomWords.join(" ");
    setText(wordString);
  };

  // Start Timer
  const startTimer = () => {
    startTimeRef.current = Date.now();
    setIsTestStarted(true);
    setIsTestCompleted(false);
  };

  // Calculate WPM
  const calculateWPM = () => {
    if (!startTimeRef.current) return 0;

    const timeElapsed = (Date.now() - startTimeRef.current) / 1000; // Time in seconds
    const wordsTyped = userText.trim().split(" ").length; // Count words
    const wpm = (wordsTyped / timeElapsed) * 60; // Calculate WPM
    setSpeed(wpm);
  };

  // Check if user has completed the test
  const checkCompletion = () => {
    if (userText.trim() === text.trim()) {
      setIsTestCompleted(true);
      clearInterval(timerRef.current!); // Stop the timer
    }
  };

  useEffect(() => {
    if (isTestStarted && !isTestCompleted) {
      // Update WPM every second
      timerRef.current = setInterval(calculateWPM, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current); // Clean up timer
    };
  }, [isTestStarted, isTestCompleted, userText]);

  useEffect(() => {
    if (userText) {
      checkCompletion();
    }
  }, [userText]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">Typing Test</h1>

      {/* Display Instructions */}
      {!isTestStarted && !isTestCompleted && (
        <div className="mb-4">
          <button onClick={() => startTimer()} className="px-4 py-2 bg-blue-500 text-white rounded">
            Start Test
          </button>
        </div>
      )}

      {/* Display Text to Type */}
      <textarea
        readOnly
        rows={6}
        cols={50}
        value={text}
        placeholder="Your text will appear here..."
        className="border p-2 mb-4 w-full"
      />

      {/* User Input Area */}
      <textarea
        rows={6}
        cols={50}
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        placeholder="Start typing..."
        className="border p-2 mb-4 w-full"
      />

      {/* Display WPM */}
      <div className="mb-4">
        <strong>Speed: </strong>
        {isTestCompleted ? `${Math.round(speed)} WPM - Test Completed` : `${Math.round(speed)} WPM`}
      </div>

      {/* Display Test Completion */}
      {isTestCompleted && (
        <div className="mt-4 text-green-500 font-semibold">Congratulations! You've completed the test.</div>
      )}

      {/* Button to generate new text */}
      {!isTestStarted && !isTestCompleted && (
        <button
          onClick={() => autoWordGenerator(25)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Generate Text
        </button>
      )}
    </div>
  );
};

export default TypingTest;

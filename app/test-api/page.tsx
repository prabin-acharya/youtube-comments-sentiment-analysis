"use client";

import { useState } from "react";

export default function TestAPIdeo() {
  const [inputComment, setInputComment] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [previousComment, setPreviousComment] = useState<string>("");

  const predictEmotionAPI = async () => {
    if (inputComment.length < 5) return;

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputComment }),
      });

      if (!response.ok) {
        throw new Error("Error predicting emotion");
      }

      const data = await response.json();
      setResult(data.predicted_emotion);
      setPreviousComment(inputComment);
      setInputComment("");
    } catch (error) {
      console.error("Error predicting emotion:", error);
      setResult("Error predicting emotion. Please try again.");
    }
  };
  return (
    <main className="flex min-h-screen flex-col p-16">
      <div className="w-1/2  mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-amber-700">
          Test Sentiment Analysis API
        </h2>
        <div className="max-w-screen-md mx-auto">
          <div>
            <input
              type="text"
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              placeholder="Enter a comment..."
              className=" border border-slate-600 text-xl p-2 outline-none rounded bg-slate-500 focus:border-slate-400 text-white"
            />
            <button
              onClick={() => predictEmotionAPI()}
              className="py-2 px-4 rounded bg-sky-700 mx-4 text-white"
            >
              Predict
            </button>
          </div>

          {result && (
            <div className="p-4 mt-12 bg-slate-500 rounded w-2/3 text-white">
              <div className="flex mb-2">
                <span className="font-semibold mr-2">Comment: </span>{" "}
                <p>{previousComment}</p>
              </div>
              <div className="flex">
                <span className="font-semibold mr-2">Prediceted Emotion: </span>{" "}
                <p>{result}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

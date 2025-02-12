"use client";

import { useCallback, useState } from "react";

export default function Home() {
  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(null);

  const [userText, setUserText] = useState("");

  const classify = useCallback(async () => {
    if (ready === null) setReady(false);

    // Make a request to the /classify route on the server.
    const result = await fetch(
      `/api/palette?text=${encodeURIComponent(userText)}`,
    );

    // If this is the first time we've made a request, set the ready flag.
    if (!ready) setReady(true);

    const json = await result.json();
    setResult(json);
    return json;
  }, [ready, userText]);

  const userInput = useCallback((e) => {
    setUserText(e.target.value);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">Transformers.js</h1>
      <h2 className="text-2xl mb-4 text-center">
        Next.js template (server-side)
      </h2>
      <input
        type="text"
        className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4"
        placeholder="Enter text here"
        onInput={userInput}
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={classify}
      >
        Enter prompt
      </button>

      {ready !== null && (
        <pre className="bg-gray-100 p-2 rounded">
          {!ready || !result ? "Loading..." : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}

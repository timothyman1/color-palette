"use client";

import { useState } from "react";

export const useFetchColor = () => {
  const [result, setResult] = useState(null);
  const [userText, setUserText] = useState("");
  const [movie, setMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const classify = async (usrText, film) => {
    // Wrap your async logic inside an IIFE
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/palette?text=${encodeURIComponent(usrText)}&movie=${encodeURIComponent(film)}`,
        { cache: "no-store" },
      );
      const json = await response.json();
      const values = JSON.parse(json.replace(/'/g, '"'));
      setIsLoading(false);
      setResult(values);
      return values;
    } catch (error) {
      setIsLoading(false);
    }
  };

  return [result, isLoading, userText, setUserText, movie, setMovie, classify];
};

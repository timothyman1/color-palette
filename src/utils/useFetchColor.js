"use client";

import { useState } from "react";
import { colorPaletteFetch } from "@/utils/color-palette-fetch";

export const useFetchColor = () => {
  const [result, setResult] = useState(null);
  const [userText, setUserText] = useState("");
  const [movie, setMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const classify = async (usrText, film) => {
    // Wrap your async logic inside an IIFE
    setIsLoading(true);
    try {
      // const response = await fetch(
      //   `/api/palette?text=${encodeURIComponent(usrText)}&movie=${encodeURIComponent(film)}`,
      //   { cache: "no-store" },
      // );
      const response = await colorPaletteFetch(usrText, film);
      if (response === null) throw new Error("Something went wrong");
      const values = JSON.parse(response.replace(/'/g, '"'));
      setIsLoading(false);
      setResult(values);
      return values;
    } catch (error) {
      console.log(error);
      setError(error);
      // setIsLoading(false);
    }
  };

  return [
    result,
    isLoading,
    userText,
    setUserText,
    movie,
    setMovie,
    classify,
    error,
  ];
};

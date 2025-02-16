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
    setError("");
    try {
      // const response = await fetch(
      //   `/api/palette?text=${encodeURIComponent(usrText)}&movie=${encodeURIComponent(film)}`,
      //   { cache: "no-store" },
      // );
      const response = await colorPaletteFetch(usrText, film);
      if (response === null) throw new Error("Something went wrong");
      let values;

      debugger;
      try {
        values = JSON.parse(response.replace(/'/g, '"'));
      } catch (parseError) {
        throw new Error(
          "The input format is not correct. Input the prompt describing what color palette you want.",
        );
      }
      if (
        Array.isArray(values) &&
        values.length === 5 &&
        values.every(
          (color) =>
            typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color),
        )
      ) {
        setIsLoading(false);
        setResult(values);
        return values;
      }
      throw new Error(
        "The input format is not correct. Input the prompt describing what color palette you want.",
      );
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      setIsLoading(false);
      return {
        error: error.message,
      };
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

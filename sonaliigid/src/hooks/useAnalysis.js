import { useCallback, useState } from "react";

export function useAnalysis(endpoint) {
  const [text, setText] = useState("");
  const [alpha, setAlpha] = useState(0.01);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [allExamples, setAllExamples] = useState([]);
  const [atypicalExamples, setAtypicalExamples] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Palun sisesta analüüsimiseks tekst.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${endpoint}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, alpha }),
      });

      if (!res.ok) {
        throw new Error(`Serveri viga (${res.status}).`);
      }

      const data = await res.json();

      setAllExamples(data.koik_naited || []);
      setAtypicalExamples(data.ebatyypilised_naited || []);
      setSummaryData(data.koondandmed || null);
    } catch (err) {
      setAllExamples([]);
      setAtypicalExamples([]);
      setSummaryData(null);
      setError(err instanceof Error ? err.message : "Midagi läks valesti.");
    } finally {
      setIsLoading(false);
    }
  }, [alpha, endpoint, text]);

  return {
    text,
    setText,
    alpha,
    setAlpha,
    isLoading,
    error,
    allExamples,
    atypicalExamples,
    summaryData,
    handleSubmit,
  };
}

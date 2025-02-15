import { useEffect, useState } from "react";
import api from "../util/axios";

export default function useFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch function to be called when URL changes
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(url);

      if (response.status != 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setData(response.data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

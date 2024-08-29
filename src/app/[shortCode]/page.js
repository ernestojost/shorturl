"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";

export default function ShortUrl({ params }) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      checkUrl();
      isFirstRender.current = false;
    }
  }, []);

  const checkUrl = async () => {
    try {
      const response = await fetch(`/api/${params.shortCode}`);
      if (response.ok) {
        const data = await response.json();
        if (data.isPrivate) {
          setIsPrivate(true);
        } else {
          await incrementClickCount(params.shortCode);
          router.push(data.originalUrl);
        }
      } else {
        setError("URL not found");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const incrementClickCount = async (shortCode) => {
    try {
      await fetch(`/api/increment/${shortCode}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing click count:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/${params.shortCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        await incrementClickCount(params.shortCode);
        router.push(data.originalUrl);
      } else {
        const data = await response.json();
        setError(data.error || "Error accessing URL");
      }
    } catch (error) {
      setError("Error verifying password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <PuffLoader color="#36D7B7" loading={true} />
        <p className="mt-4 text-white text-lg animate-pulse">
          Preparing your link
        </p>
      </div>
    );
  }

  if (isPrivate) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="glass-morphism p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-300">
            🔐 This URL is private
          </h2>
          <p className="mb-4 text-gray-300">
            Enter the password to access the original link.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="w-full p-3 rounded button-primary text-white font-semibold"
            disabled={submitting}
          >
            {submitting ? (
              <PuffLoader size={20} color={"#fff"} loading={submitting} />
            ) : (
              "Access 🚀"
            )}
          </button>
          <p className="text-red-600 pt-3">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-morphism p-8 text-center">
        <p className="text-gray-300">🔄 Redirecting...</p>
      </div>
    </div>
  );
}

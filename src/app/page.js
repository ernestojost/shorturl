"use client";

import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import LoadingSpinner from "./components/LoadingSpinner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalClicks: null,
    totalLinks: null,
    uniqueIPs: null,
  });
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, isPrivate, password }),
      });

      if (!response.ok) {
        throw new Error("Error shortening URL");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Ocultar después de 2 segundos
    });
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black">
      <h1 className="text-3xl font-bold mb-2 text-center text-white">
        🔗 URL Shortener
      </h1>
      <p className="text-sm text-gray-300 text-center mb-4">
        Simplify and share your links easily
      </p>
      <div className="glass-morphism p-6 w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="🌐 Enter a long URL"
            required
            className="w-full p-2 rounded input-field text-sm"
            aria-label="URL to shorten"
          />
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`w-full p-2 rounded text-sm transition-colors duration-300 ${
              isPrivate ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {isPrivate ? "🔒 Private URL" : "🔓 Public URL"}
          </button>
          {isPrivate && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password for private URL"
              required
              className="w-full p-2 rounded input-field text-sm"
              aria-label="Password for private URL"
            />
          )}
          <button
            type="submit"
            className="w-full p-2 rounded button-primary text-white font-semibold text-sm"
            disabled={submitting}
          >
            {submitting ? (
              <PuffLoader size={16} color={"#fff"} loading={submitting} />
            ) : (
              "✂️ Shorten URL"
            )}
          </button>
        </form>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
        {shortUrl && (
          <div className="mt-4 p-3 bg-gray-800 rounded transition-opacity duration-500 opacity-0 animate-fade-in">
            <div className="flex flex-col items-center justify-between">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all text-sm font-bold mb-2"
              >
                {shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-sm"
                aria-label="Copy to clipboard"
              >
                📋 Copy
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 glass-morphism p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          📊 Statistics
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            {stats.totalClicks !== null ? (
              <p className="text-2xl font-bold text-blue-400">
                {stats.totalClicks}
              </p>
            ) : (
              <LoadingSpinner />
            )}
            <p className="text-sm text-gray-300">Total Redirects</p>
          </div>
          <div>
            {stats.totalLinks !== null ? (
              <p className="text-2xl font-bold text-green-400">
                {stats.totalLinks}
              </p>
            ) : (
              <LoadingSpinner />
            )}
            <p className="text-sm text-gray-300">Links Created</p>
          </div>
          <div>
            {stats.uniqueIPs !== null ? (
              <p className="text-2xl font-bold text-purple-400">
                {stats.uniqueIPs}
              </p>
            ) : (
              <LoadingSpinner />
            )}
            <p className="text-sm text-gray-300">Unique Visitors</p>
          </div>
        </div>
      </div>
      <footer className="text-white text-center text-sm mt-8">
        <p>
          &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
        </p>
        <p className="">
          Designed and developed by{" "}
          <a
            className="font-bold"
            href="https://reddevs.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ernesto Jost
          </a>
        </p>
      </footer>
      {copySuccess && <div className="popup-message">Copied to clipboard!</div>}
    </main>
  );
}

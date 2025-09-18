import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Article = {
  title: string;
  description: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt?: string | null;
  source?: { name?: string } | null;
};

const News: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call your Vercel serverless function (relative path)
        const resp = await fetch('/api/news');

        const text = await resp.text();

        if (!resp.ok) {
          // Try to parse JSON error message, otherwise show raw text
          try {
            const parsed = JSON.parse(text);
            throw new Error(parsed.message || parsed.error || JSON.stringify(parsed));
          } catch (e) {
            throw new Error(text || `HTTP ${resp.status}`);
          }
        }

        const data = JSON.parse(text);

        if (!mounted) return;
        setNews(Array.isArray(data.articles) ? data.articles : []);
      } catch (err: any) {
        console.error('Error fetching news:', err);
        if (mounted) setError(err.message || 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-red-800 text-white flex flex-col items-center py-12 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold mb-4 text-center bg-gradient-to-r from-red-400 via-yellow-400 to-red-600 bg-clip-text text-transparent"
      >
        RCB News
      </motion.h1>

      <p className="text-gray-300 mb-12 text-center text-lg max-w-2xl">
        Stay updated with the latest Royal Challengers Bangalore news, match reports, and exciting updates.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gradient-to-br from-red-900 to-red-700 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-2xl text-center text-red-300 bg-red-900/30 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Error loading news</h3>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
            {news.slice(0, visibleCount).map((article, index) => (
              <motion.a
                href={article.url}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-red-800/60 to-black/50 shadow-xl hover:shadow-red-600/50 border border-red-700/50 transition flex flex-col"
              >
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="h-48 w-full object-cover" />
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                    <span>{article.source?.name || 'Unknown Source'}</span>
                    <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
                  </div>

                  <h2 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h2>

                  <p className="text-gray-300 text-sm flex-grow line-clamp-3">{article.description || ''}</p>

                  <span className="mt-4 inline-block font-semibold text-sm text-transparent bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text">Read more →</span>
                </div>
              </motion.a>
            ))}
          </div>

          {visibleCount < news.length && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="mt-12 px-8 py-3 rounded-full font-bold bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 shadow-lg hover:shadow-yellow-400/50 transition border-2 border-red-500"
            >
              Load More
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default News;

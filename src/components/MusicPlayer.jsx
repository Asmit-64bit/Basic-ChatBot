import { useState } from 'react';
import './MusicPlayer.css';

export function MusicPlayer({ query }) {
    const [videoId, setVideoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    // Try to find a video ID using YouTube's oEmbed-like approach
    async function findAndPlay() {
        setLoading(true);
        setError(false);
        try {
            // Use a well-known search term to get a piped/invidious result
            const res = await fetch(
                `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=music_songs`
            );
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                const id = data.items[0].url.replace('/watch?v=', '');
                setVideoId(id);
            } else {
                setError(true);
            }
        } catch {
            // Fallback: just open YouTube
            setError(true);
        }
        setLoading(false);
    }

    return (
        <div className="music-player">
            <div className="music-player-header">
                <span className="music-player-icon">🎵</span>
                <div className="music-player-info">
                    <span className="music-player-label">{query}</span>
                    <span className="music-player-sub">Music</span>
                </div>
            </div>

            {videoId ? (
                <div className="music-player-embed">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={`Music: ${query}`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="music-iframe"
                    ></iframe>
                </div>
            ) : error ? (
                <div className="music-player-fallback">
                    <p>Couldn't auto-find a track. Try searching directly:</p>
                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="music-yt-link">
                        Search "{query}" on YouTube ↗
                    </a>
                </div>
            ) : (
                <div className="music-player-actions">
                    <button className="music-play-btn" onClick={findAndPlay} disabled={loading}>
                        {loading ? (
                            <span>Searching...</span>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                <span>Play</span>
                            </>
                        )}
                    </button>
                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="music-yt-link">
                        Open on YouTube ↗
                    </a>
                </div>
            )}
        </div>
    );
}

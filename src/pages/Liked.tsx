import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { SongCard } from '@/components/SongCard';
import { Song } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { YouTubeApiService } from '@/services/youtubeApi';
import { adaptYouTubeSongsToSongs } from '@/lib/youtubeSongAdapter';
import { toast } from 'sonner';

const Liked = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        // For demo, load some favorite tracks
        const ytSongs = await YouTubeApiService.searchSongs('favorite songs', 12);
        const adapted = adaptYouTubeSongsToSongs(ytSongs);
        setLikedSongs(adapted);
      } catch (error) {
        console.error('Error loading liked songs:', error);
        toast.error('Failed to load liked songs');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadLikedSongs();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to view your liked songs</h2>
          <p className="text-muted-foreground mb-6">
            Save your favorite tracks and access them anywhere
          </p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="gradient-accent p-8 mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-48 h-48 bg-primary/20 rounded-lg flex items-center justify-center">
            <Heart className="w-24 h-24 text-accent" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm mb-2">Playlist</p>
            <h1 className="text-6xl font-bold mb-4">Liked Songs</h1>
            <p className="text-accent-foreground/80">
              {isLoading ? 'Loading...' : `${likedSongs.length} ${likedSongs.length === 1 ? 'song' : 'songs'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : likedSongs.length > 0 ? (
          <div className="space-y-2">
            {likedSongs.map((song) => (
              <SongCard key={song.id} song={song} compact />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No liked songs yet</h3>
            <p className="text-muted-foreground">
              Songs you like will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;

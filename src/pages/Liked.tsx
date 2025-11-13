import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { SongCard } from '@/components/SongCard';
import { Song } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { likedSongsService } from '@/lib/playlistService';
import { toast } from 'sonner';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const Liked = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLikedSongs();
    }
  }, [user]);

  const loadLikedSongs = async () => {
    try {
      setIsLoading(true);
      const songs = await likedSongsService.getLikedSongs();
      setLikedSongs(songs);
    } catch (error) {
      console.error('Error loading liked songs:', error);
      toast.error('Failed to load liked songs');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <GlowingEffect
          spread={60}
          blur={20}
          glow={true}
          disabled={false}
          proximity={100}
          inactiveZone={0.01}
          borderWidth={2}
          className="fixed inset-0 z-0"
        />
        <div className="relative z-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Sign in to view your liked songs</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
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
    <div className="relative min-h-screen pb-24 sm:pb-28 pt-16 lg:pt-0">
      <GlowingEffect
        spread={60}
        blur={20}
        glow={true}
        disabled={true}
        proximity={100}
        inactiveZone={0.01}
        borderWidth={2}
        className="fixed inset-0 z-0"
      />
      {/* Header */}
      <div className="relative z-10 gradient-accent p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-primary/20 rounded-lg flex items-center justify-center">
            <Heart className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-accent" fill="currentColor" />
          </div>
          <div>
            <p className="text-xs sm:text-sm mb-1 sm:mb-2">Playlist</p>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">Liked Songs</h1>
            <p className="text-accent-foreground/80 text-sm sm:text-base">
              {isLoading ? 'Loading...' : `${likedSongs.length} ${likedSongs.length === 1 ? 'song' : 'songs'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
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
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No liked songs yet</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Songs you like will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;

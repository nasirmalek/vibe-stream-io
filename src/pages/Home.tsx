import { useState, useEffect } from 'react';
import { SongCard } from '@/components/SongCard';
import { Song } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { YouTubeApiService } from '@/services/youtubeApi';
import { adaptYouTubeSongsToSongs } from '@/lib/youtubeSongAdapter';
import { toast } from 'sonner';

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true);
        
        // Load featured tracks (trending music)
        const featuredYtSongs = await YouTubeApiService.searchSongs('top music 2024 hits', 12);
        const featured = adaptYouTubeSongsToSongs(featuredYtSongs);
        setFeaturedSongs(featured.slice(0, 6));
        
        // Load popular tracks (popular songs)
        const popularYtSongs = await YouTubeApiService.searchSongs('popular songs 2024', 10);
        const popular = adaptYouTubeSongsToSongs(popularYtSongs);
        setPopularSongs(popular.slice(0, 5));
      } catch (error) {
        console.error('Error loading songs:', error);
        toast.error('Failed to load songs');
      } finally {
        setIsLoading(false);
      }
    };

    loadSongs();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="gradient-primary p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{getGreeting()}</h1>
            {user && (
              <p className="text-primary-foreground/80">Welcome back, {user.email}</p>
            )}
          </div>
          <div className="flex gap-2">
            {user ? (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => navigate('/library')}
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="px-8">
          {/* Featured Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Tracks</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>

          {/* Popular Songs */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Popular Right Now</h2>
            <div className="space-y-2">
              {popularSongs.map((song) => (
                <SongCard key={song.id} song={song} compact />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;

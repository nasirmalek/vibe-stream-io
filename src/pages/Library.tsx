import { useState, useEffect } from 'react';
import { Music, ListMusic, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SongCard } from '@/components/SongCard';
import { Song, mockPlaylists } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { iTunesApiService } from '@/services/iTunesApi';
import { adaptITunesSongsToSongs } from '@/lib/songAdapter';
import { toast } from 'sonner';

const Library = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [librarySongs, setLibrarySongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLibrarySongs = async () => {
      try {
        // Load user's library songs (for demo, load recommended songs)
        const iTunesSongs = await iTunesApiService.getRecommendations();
        const adapted = adaptITunesSongsToSongs(iTunesSongs);
        setLibrarySongs(adapted);
      } catch (error) {
        console.error('Error loading library:', error);
        toast.error('Failed to load library');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadLibrarySongs();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to view your library</h2>
          <p className="text-muted-foreground mb-6">
            Create playlists, save your favorite songs, and more
          </p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Library</h1>

        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="playlists" className="gap-2">
              <ListMusic className="w-4 h-4" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="songs" className="gap-2">
              <Music className="w-4 h-4" />
              Songs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists" className="space-y-6">
            {mockPlaylists.map((playlist) => (
              <div key={playlist.id} className="bg-card p-6 rounded-lg shadow-card">
                <div className="flex gap-6 mb-6">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-32 h-32 rounded-lg object-cover shadow-card"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground mb-2">Playlist</p>
                    <h2 className="text-3xl font-bold mb-2">{playlist.name}</h2>
                    <p className="text-muted-foreground mb-2">{playlist.description}</p>
                    <p className="text-sm">
                      {playlist.createdBy} • {playlist.songs.length} songs
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {playlist.songs.map((song) => (
                    <SongCard key={song.id} song={song} compact />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="songs">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {librarySongs.map((song) => (
                  <SongCard key={song.id} song={song} compact />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;

import { useState, useEffect } from 'react';
import { Music, ListMusic, Loader2, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SongCard } from '@/components/SongCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { playlistService, Playlist } from '@/lib/playlistService';
import { toast } from 'sonner';
import { CreatePlaylistDialog } from '@/components/CreatePlaylistDialog';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const Library = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    try {
      setIsLoading(true);
      const data = await playlistService.getUserPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error loading playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await playlistService.deletePlaylist(playlistId);
      toast.success('Playlist deleted');
      loadPlaylists();
    } catch (error: any) {
      console.error('Error deleting playlist:', error);
      toast.error(error.message || 'Failed to delete playlist');
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
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
        <div className="relative z-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Sign in to view your library</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
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
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8 pb-24 sm:pb-28 pt-16 lg:pt-8">
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
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Your Library</h1>
          <CreatePlaylistDialog onPlaylistCreated={loadPlaylists} />
        </div>

        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="mb-6 sm:mb-8">
            <TabsTrigger value="playlists" className="gap-2 text-xs sm:text-sm">
              <ListMusic className="w-3 h-3 sm:w-4 sm:h-4" />
              Playlists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-12">
                <ListMusic className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No playlists yet</h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-4">
                  Create your first playlist to get started
                </p>
                <CreatePlaylistDialog onPlaylistCreated={loadPlaylists} />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="bg-card p-4 sm:p-6 rounded-lg shadow-card">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <img
                        src={playlist.cover_url}
                        alt={playlist.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover shadow-card"
                      />
                      <div className="flex flex-col justify-center flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Playlist</p>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{playlist.name}</h2>
                        {playlist.description && (
                          <p className="text-sm sm:text-base text-muted-foreground mb-1 sm:mb-2">{playlist.description}</p>
                        )}
                        <p className="text-xs sm:text-sm">
                          {playlist.songs?.length || 0} {playlist.songs?.length === 1 ? 'song' : 'songs'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {playlist.songs && playlist.songs.length > 0 ? (
                      <div className="space-y-2">
                        {playlist.songs.map((song) => (
                          <SongCard key={song.id} song={song} compact />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8 text-sm">
                        No songs in this playlist yet
                      </p>
                    )}
                  </div>
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

import { useState, useEffect } from 'react';
import { Play, MoreVertical, Heart, Plus, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song, formatDuration } from '@/lib/mockData';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { cn } from '@/lib/utils';
import { likedSongsService, playlistService } from '@/lib/playlistService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreatePlaylistDialog } from '@/components/CreatePlaylistDialog';

interface SongCardProps {
  song: Song;
  showCover?: boolean;
  compact?: boolean;
}

export const SongCard = ({ song, showCover = true, compact = false }: SongCardProps) => {
  const { playSong, currentSong, isPlaying, setQueue, queue, addToQueue } = useMusicPlayer();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  const isCurrentSong = currentSong?.id === song.id;

  useEffect(() => {
    if (user) {
      checkIfLiked();
      loadPlaylists();
    }
  }, [song.id, user]);

  const loadPlaylists = async () => {
    try {
      const userPlaylists = await playlistService.getUserPlaylists();
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const checkIfLiked = async () => {
    try {
      const liked = await likedSongsService.isSongLiked(song.id);
      setIsLiked(liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handlePlay = () => {
    if (!queue.find(s => s.id === song.id)) {
      setQueue([song]);
    }
    playSong(song);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to like songs');
      return;
    }

    setLiking(true);
    try {
      if (isLiked) {
        await likedSongsService.unlikeSong(song.id);
        setIsLiked(false);
        toast.success('Removed from liked songs');
      } else {
        await likedSongsService.likeSong(song);
        setIsLiked(true);
        toast.success('Added to liked songs');
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error(error.message || 'Failed to update like status');
    } finally {
      setLiking(false);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    toast.success('Added to queue');
  };

  const handleAddToPlaylist = async (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add to playlist');
      return;
    }
    try {
      await playlistService.addSongToPlaylist(playlistId, song);
      toast.success('Added to playlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to playlist');
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          'group flex items-center gap-3 p-3 rounded-lg transition-smooth hover:bg-secondary/50 cursor-pointer',
          isCurrentSong && isPlaying && 'bg-primary/5'
        )}
        onClick={handlePlay}
      >
        {showCover && (
          <div className="relative">
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
              <Play className="w-5 h-5 text-white" fill="white" />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium truncate', isCurrentSong && 'text-primary')}>
            {song.title}
          </p>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{formatDuration(song.duration)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            disabled={liking}
            className={cn(
              'transition-all',
              isLiked ? 'text-primary' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAddToQueue}>
                <ListPlus className="w-4 h-4 mr-2" />
                Add to Queue
              </DropdownMenuItem>
              {playlists.length > 0 ? (
                playlists.map(playlist => (
                  <DropdownMenuItem 
                    key={playlist.id}
                    onClick={(e) => handleAddToPlaylist(e, playlist.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {playlist.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowCreatePlaylist(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Playlist
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card p-4 rounded-lg hover:bg-secondary/50 transition-smooth shadow-card">
      <div className="relative mb-4">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        <Button
          size="icon"
          onClick={handlePlay}
          className={cn(
            'absolute bottom-2 right-2 w-12 h-12 rounded-full shadow-glow transition-all',
            'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
            isCurrentSong && isPlaying && 'opacity-100 translate-y-0'
          )}
        >
          <Play className="w-5 h-5" fill="currentColor" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          disabled={liking}
          className={cn(
            'absolute top-2 right-2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 transition-all',
            isLiked ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
        </Button>
      </div>
      <h3 className="font-semibold truncate mb-1">{song.title}</h3>
      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      <CreatePlaylistDialog 
        open={showCreatePlaylist} 
        onOpenChange={setShowCreatePlaylist}
        onPlaylistCreated={loadPlaylists}
      />
    </div>
  );
};

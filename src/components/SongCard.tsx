import { Play, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song, formatDuration } from '@/lib/mockData';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { cn } from '@/lib/utils';

interface SongCardProps {
  song: Song;
  showCover?: boolean;
  compact?: boolean;
}

export const SongCard = ({ song, showCover = true, compact = false }: SongCardProps) => {
  const { playSong, currentSong, isPlaying, setQueue, queue } = useMusicPlayer();

  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = () => {
    if (!queue.find(s => s.id === song.id)) {
      setQueue([song]);
    }
    playSong(song);
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
        <span className="text-sm text-muted-foreground">{formatDuration(song.duration)}</span>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4" />
        </Button>
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
      </div>
      <h3 className="font-semibold truncate mb-1">{song.title}</h3>
      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, Shuffle, Repeat, Play, Pause, SkipBack, SkipForward, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { formatDuration } from '@/lib/mockData';
import { fetchLyrics, LyricsResponse } from '@/services/lyricsApi';
import { likedSongsService } from '@/lib/playlistService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LyricLine {
  time: number;
  text: string;
}

const NowPlaying = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextSong,
    previousSong,
    seek,
    queue,
    isShuffleOn,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
  } = useMusicPlayer();

  const [lyrics, setLyrics] = useState<LyricsResponse>({ lyrics: null });
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [parsedLyrics, setParsedLyrics] = useState<LyricLine[]>([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSong) {
      loadLyrics();
      checkIfLiked();
      setActiveLyricIndex(-1);
    }
  }, [currentSong?.id]);

  useEffect(() => {
    if (parsedLyrics.length === 0) return;

    let activeIndex = -1;
    for (let i = parsedLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= parsedLyrics[i].time) {
        activeIndex = i;
        break;
      }
    }
    
    setActiveLyricIndex(activeIndex);
  }, [currentTime, parsedLyrics]);

  useEffect(() => {
    if (activeLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeLine = activeLineRef.current;
      
      const containerHeight = container.clientHeight;
      const lineTop = activeLine.offsetTop;
      const lineHeight = activeLine.clientHeight;
      
      const scrollTo = lineTop - containerHeight / 2 + lineHeight / 2;
      
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  }, [activeLyricIndex]);

  const parseLRC = (lrcText: string): LyricLine[] => {
    const lines = lrcText.split('\n');
    const parsed: LyricLine[] = [];
    
    lines.forEach(line => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3].padEnd(3, '0'));
        const time = minutes * 60 + seconds + milliseconds / 1000;
        const text = match[4].trim();
        if (text) {
          parsed.push({ time, text });
        }
      }
    });
    
    return parsed.sort((a, b) => a.time - b.time);
  };

  const loadLyrics = async () => {
    if (!currentSong) return;
    
    setIsLoadingLyrics(true);
    const result = await fetchLyrics(currentSong.artist, currentSong.title);
    setLyrics(result);
    
    if (result.lyrics) {
      const parsed = parseLRC(result.lyrics);
      setParsedLyrics(parsed);
    } else {
      setParsedLyrics([]);
    }
    
    setIsLoadingLyrics(false);
  };

  const checkIfLiked = async () => {
    if (!user || !currentSong) return;
    try {
      const liked = await likedSongsService.isSongLiked(currentSong.id);
      setIsLiked(liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (!user || !currentSong) {
      toast.error('Please sign in to like songs');
      return;
    }

    try {
      if (isLiked) {
        await likedSongsService.unlikeSong(currentSong.id);
        setIsLiked(false);
        toast.success('Removed from liked songs');
      } else {
        await likedSongsService.likeSong(currentSong);
        setIsLiked(true);
        toast.success('Added to liked songs');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update like status');
    }
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">No song playing</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-background to-background pb-20 sm:pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-primary/10 h-9 w-9 sm:h-10 sm:w-10"
          >
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <div className="text-center flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Playing from</p>
            <p className="text-sm sm:text-base font-semibold">Queue</p>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-9 w-9 sm:h-10 sm:w-10">
            <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left: Album Art & Controls */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Album Art */}
              <div className="relative w-full max-w-[340px] sm:max-w-md aspect-square">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-2xl"
                />
              </div>

              {/* Song Info & Like */}
              <div className="w-full max-w-[340px] sm:max-w-md flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate mb-1 sm:mb-2">
                    {currentSong.title}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground truncate">
                    {currentSong.artist}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className={cn(
                    'hover:bg-primary/10 transition-all h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0',
                    isLiked && 'text-primary'
                  )}
                >
                  <Heart className={cn('w-6 h-6 sm:w-7 sm:h-7', isLiked && 'fill-current')} />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-[340px] sm:max-w-md space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>{formatDuration(Math.floor(currentTime))}</span>
                  <span>{formatDuration(Math.floor(duration))}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="w-full max-w-[340px] sm:max-w-md flex items-center justify-between px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={cn(
                    'hover:bg-primary/10 h-9 w-9 sm:h-10 sm:w-10',
                    isShuffleOn && 'text-primary'
                  )}
                >
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                <div className="flex items-center gap-2 sm:gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={previousSong}
                    className="hover:bg-primary/10 h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>

                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary hover:bg-primary/90 shadow-glow"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" />
                    ) : (
                      <Play className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSong}
                    className="hover:bg-primary/10 h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={cn(
                    'hover:bg-primary/10 relative h-9 w-9 sm:h-10 sm:w-10',
                    repeatMode !== 'off' && 'text-primary'
                  )}
                >
                  <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                  {repeatMode === 'one' && (
                    <span className="absolute text-[10px] sm:text-xs font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      1
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Right: Lyrics & Queue */}
            <div className="w-full">
              <Tabs defaultValue="lyrics" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
                  <TabsTrigger value="lyrics" className="text-sm sm:text-base">Lyrics</TabsTrigger>
                  <TabsTrigger value="queue" className="text-sm sm:text-base">Queue ({queue.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="lyrics" className="mt-0">
                  <div className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border bg-card overflow-hidden">
                    {isLoadingLyrics ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm sm:text-base text-muted-foreground">Loading lyrics...</p>
                      </div>
                    ) : parsedLyrics.length > 0 ? (
                      <div 
                        ref={lyricsContainerRef}
                        className="h-full overflow-y-auto px-4 sm:px-6 py-20"
                      >
                        {parsedLyrics.map((line, index) => (
                          <div
                            key={index}
                            ref={index === activeLyricIndex ? activeLineRef : null}
                            className={cn(
                              "py-2 sm:py-3 transition-all duration-300 text-center cursor-pointer",
                              index === activeLyricIndex 
                                ? "text-primary font-semibold text-lg sm:text-2xl scale-105" 
                                : "text-muted-foreground text-sm sm:text-base hover:text-foreground"
                            )}
                            onClick={() => seek(line.time)}
                          >
                            {line.text}
                          </div>
                        ))}
                      </div>
                    ) : lyrics.lyrics ? (
                      <div className="h-full overflow-y-auto px-4 sm:px-6 py-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
                          {lyrics.lyrics}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <p className="text-sm sm:text-base text-muted-foreground mb-2">
                          Lyrics not available for this song
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {lyrics.error}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="queue" className="mt-0">
                  <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border bg-card">
                    <div className="p-1 sm:p-2">
                      {queue.map((song, index) => (
                        <div
                          key={`${song.id}-${index}`}
                          className={cn(
                            'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-secondary/50 transition-smooth cursor-pointer',
                            currentSong.id === song.id && 'bg-primary/10'
                          )}
                        >
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm sm:text-base font-medium truncate',
                              currentSong.id === song.id && 'text-primary'
                            )}>
                              {song.title}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {song.artist}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;

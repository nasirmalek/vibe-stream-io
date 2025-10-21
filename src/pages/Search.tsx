import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SongCard } from '@/components/SongCard';
import { Song } from '@/lib/mockData';
import { YouTubeApiService } from '@/services/youtubeApi';
import { adaptYouTubeSongsToSongs } from '@/lib/youtubeSongAdapter';
import { toast } from 'sonner';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [browseSongs, setBrowseSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingBrowse, setIsLoadingBrowse] = useState(true);

  // Load browse songs on mount
  useEffect(() => {
    const loadBrowseSongs = async () => {
      try {
        const ytSongs = await YouTubeApiService.searchSongs('top hits 2024', 24);
        const adapted = adaptYouTubeSongsToSongs(ytSongs);
        setBrowseSongs(adapted);
      } catch (error) {
        console.error('Error loading browse songs:', error);
        toast.error('Failed to load songs');
      } finally {
        setIsLoadingBrowse(false);
      }
    };

    loadBrowseSongs();
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSongs([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const ytSongs = await YouTubeApiService.searchSongs(searchQuery, 50);
        const adapted = adaptYouTubeSongsToSongs(ytSongs);
        setSongs(adapted);
      } catch (error) {
        console.error('Error searching songs:', error);
        toast.error('Failed to search songs');
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-24 sm:pb-28 pt-16 lg:pt-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Search</h1>

        <div className="relative mb-8 sm:mb-12">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base bg-card border-border"
          />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground animate-spin" />
          )}
        </div>

        {searchQuery ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {isSearching ? 'Searching...' : `${songs.length} ${songs.length === 1 ? 'result' : 'results'} for "${searchQuery}"`}
            </h2>
            {songs.length > 0 ? (
              <div className="space-y-2">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} compact />
                ))}
              </div>
            ) : !isSearching ? (
              <p className="text-muted-foreground text-center py-12 text-sm sm:text-base">
                No songs found. Try a different search term.
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Browse All</h2>
            {isLoadingBrowse ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {browseSongs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SongCard } from '@/components/SongCard';
import { mockSongs } from '@/lib/mockData';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 pb-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Search</h1>

        <div className="relative mb-12">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-card border-border"
          />
        </div>

        {searchQuery ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {filteredSongs.length} {filteredSongs.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </h2>
            {filteredSongs.length > 0 ? (
              <div className="space-y-2">
                {filteredSongs.map((song) => (
                  <SongCard key={song.id} song={song} compact />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                No songs found. Try a different search term.
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Browse All</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

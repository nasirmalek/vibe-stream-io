export interface iTunesSong {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  trackTimeMillis: number;
  artworkUrl100: string;
  artworkUrl60: string;
  previewUrl: string;
  releaseDate: string;
  primaryGenreName: string;
}

interface iTunesResponse {
  resultCount: number;
  results: iTunesSong[];
}

const ITUNES_API_BASE = 'https://itunes.apple.com/search';

export class iTunesApiService {
  static async searchSongs(query: string, limit: number = 50): Promise<iTunesSong[]> {
    try {
      const params = new URLSearchParams({
        term: query,
        media: 'music',
        entity: 'song',
        limit: limit.toString(),
      });

      const response = await fetch(`${ITUNES_API_BASE}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from iTunes API');
      }

      const data: iTunesResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching iTunes:', error);
      return [];
    }
  }

  static async getTopSongs(genre: string = 'pop', limit: number = 50): Promise<iTunesSong[]> {
    try {
      // Search for popular artists in the genre to get recent songs
      const popularSearchTerms = ['top hits', 'best songs', 'popular music'];
      const randomTerm = popularSearchTerms[Math.floor(Math.random() * popularSearchTerms.length)];
      
      const params = new URLSearchParams({
        term: `${randomTerm} ${genre}`,
        media: 'music',
        entity: 'song',
        limit: limit.toString(),
      });

      const response = await fetch(`${ITUNES_API_BASE}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from iTunes API');
      }

      const data: iTunesResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching top songs:', error);
      return [];
    }
  }

  static async getRecommendations(artistName?: string): Promise<iTunesSong[]> {
    try {
      const searchTerm = artistName || 'trending music';
      const params = new URLSearchParams({
        term: searchTerm,
        media: 'music',
        entity: 'song',
        limit: '25',
      });

      const response = await fetch(`${ITUNES_API_BASE}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data: iTunesResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }
}

import { supabase } from '@/integrations/supabase/client';

export interface YouTubeSong {
  videoId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export class YouTubeApiService {
  static async searchSongs(query: string, maxResults: number = 25): Promise<YouTubeSong[]> {
    try {
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { query, maxResults }
      });

      if (error) {
        console.error('Error calling youtube-search function:', error);
        throw error;
      }

      if (!data || !data.results) {
        console.error('No results returned from YouTube search');
        return [];
      }

      return data.results.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return [];
    }
  }
}

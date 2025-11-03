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
      // Get API key from localStorage
      const apiKey = localStorage.getItem('youtube_api_key');
      
      if (!apiKey) {
        console.error('YouTube API key not found in localStorage');
        return [];
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query + ' official audio')}&key=${apiKey}`
      );

      if (!response.ok) {
        console.error('YouTube API request failed:', response.statusText);
        return [];
      }

      const data = await response.json();

      if (!data.items) {
        console.error('No results returned from YouTube search');
        return [];
      }

      return data.items.map((item: any) => ({
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

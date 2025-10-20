import { YouTubeSong } from '@/services/youtubeApi';
import { Song } from './mockData';

export const adaptYouTubeSongToSong = (ytSong: YouTubeSong): Song => {
  // Parse title to extract song name and artist if formatted like "Artist - Song"
  const titleParts = ytSong.title.split(' - ');
  const songTitle = titleParts.length > 1 ? titleParts[1].trim() : ytSong.title;
  const artist = titleParts.length > 1 ? titleParts[0].trim() : ytSong.artist;

  return {
    id: ytSong.videoId,
    title: songTitle.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim(), // Remove parentheses
    artist: artist.replace(/VEVO$/, '').replace(/Topic$/, '').trim(), // Clean up artist name
    album: 'YouTube',
    duration: 0, // YouTube videos don't have duration in search results
    coverUrl: ytSong.thumbnailUrl,
    audioUrl: `https://www.youtube.com/watch?v=${ytSong.videoId}`,
  };
};

export const adaptYouTubeSongsToSongs = (ytSongs: YouTubeSong[]): Song[] => {
  return ytSongs.map(adaptYouTubeSongToSong);
};

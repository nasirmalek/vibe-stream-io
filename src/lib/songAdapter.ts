import { iTunesSong } from '@/services/iTunesApi';
import { Song } from './mockData';

export const adaptITunesSongToSong = (iTunesSong: iTunesSong): Song => {
  return {
    id: iTunesSong.trackId.toString(),
    title: iTunesSong.trackName,
    artist: iTunesSong.artistName,
    album: iTunesSong.collectionName || iTunesSong.trackName,
    duration: Math.floor(iTunesSong.trackTimeMillis / 1000),
    coverUrl: iTunesSong.artworkUrl100.replace('100x100', '600x600'), // Get higher quality
    audioUrl: iTunesSong.previewUrl, // 30-second preview
  };
};

export const adaptITunesSongsToSongs = (iTunesSongs: iTunesSong[]): Song[] => {
  return iTunesSongs.map(adaptITunesSongToSong);
};

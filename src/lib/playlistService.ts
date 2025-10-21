import { supabase } from '@/integrations/supabase/client';
import { Song } from './mockData';

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_url: string;
  created_at: string;
  updated_at: string;
  songs?: Song[];
}

export const playlistService = {
  // Create a new playlist
  async createPlaylist(name: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('playlists')
      .insert({
        name,
        description: description || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all playlists for current user
  async getUserPlaylists() {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch songs for each playlist
    const playlistsWithSongs = await Promise.all(
      (data || []).map(async (playlist) => {
        const { data: songs } = await supabase
          .from('playlist_songs')
          .select('song_data')
          .eq('playlist_id', playlist.id)
          .order('position');

        return {
          ...playlist,
          songs: songs?.map((s) => s.song_data as unknown as Song) || [],
        };
      })
    );

    return playlistsWithSongs;
  },

  // Add song to playlist
  async addSongToPlaylist(playlistId: string, song: Song) {
    // Get current max position
    const { data: existing } = await supabase
      .from('playlist_songs')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: false })
      .limit(1);

    const position = existing && existing.length > 0 ? existing[0].position + 1 : 0;

    const { error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: playlistId,
        song_data: song as any,
        position,
      });

    if (error) throw error;
  },

  // Remove song from playlist
  async removeSongFromPlaylist(playlistId: string, songId: string) {
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('song_data->>id', songId);

    if (error) throw error;
  },

  // Delete playlist
  async deletePlaylist(playlistId: string) {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId);

    if (error) throw error;
  },
};

export const likedSongsService = {
  // Like a song
  async likeSong(song: Song) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('liked_songs')
      .insert({
        song_id: song.id,
        song_data: song as any,
        user_id: user.id,
      });

    if (error) throw error;
  },

  // Unlike a song
  async unlikeSong(songId: string) {
    const { error } = await supabase
      .from('liked_songs')
      .delete()
      .eq('song_id', songId);

    if (error) throw error;
  },

  // Check if song is liked
  async isSongLiked(songId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('liked_songs')
      .select('id')
      .eq('song_id', songId)
      .single();

    return !error && !!data;
  },

  // Get all liked songs
  async getLikedSongs(): Promise<Song[]> {
    const { data, error } = await supabase
      .from('liked_songs')
      .select('song_data')
      .order('liked_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((item) => item.song_data as unknown as Song);
  },
};

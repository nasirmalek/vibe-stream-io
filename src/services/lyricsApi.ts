export interface LyricsResponse {
  lyrics: string | null;
  error?: string;
}

export const fetchLyrics = async (artist: string, title: string): Promise<LyricsResponse> => {
  try {
    // Clean up artist and title for better API results
    const cleanArtist = artist.replace(/VEVO$/, '').replace(/Topic$/, '').trim();
    const cleanTitle = title.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
    
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`
    );
    
    if (!response.ok) {
      return { lyrics: null, error: 'Lyrics not found' };
    }
    
    const data = await response.json();
    return { lyrics: data.lyrics || null };
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return { lyrics: null, error: 'Failed to fetch lyrics' };
  }
};

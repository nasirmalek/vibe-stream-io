export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
  createdBy: string;
}

// Mock songs data
export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Wave",
    album: "Neon Nights",
    duration: 243,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "2",
    title: "Electric Soul",
    artist: "The Synths",
    album: "Digital Hearts",
    duration: 198,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "3",
    title: "Cosmic Journey",
    artist: "Stellar Beats",
    album: "Beyond Stars",
    duration: 267,
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "4",
    title: "Urban Pulse",
    artist: "City Lights",
    album: "Concrete Jungle",
    duration: 221,
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "5",
    title: "Velvet Skies",
    artist: "Dreamy Collective",
    album: "Cloud Nine",
    duration: 289,
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: "6",
    title: "Rhythm of the Night",
    artist: "Bass Empire",
    album: "Underground",
    duration: 255,
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "7",
    title: "Sunset Boulevard",
    artist: "West Coast Vibes",
    album: "California Dreams",
    duration: 234,
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "8",
    title: "Digital Love",
    artist: "Future Sounds",
    album: "2099",
    duration: 276,
    coverUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: "p1",
    name: "Chill Vibes",
    description: "Perfect for relaxing",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    songs: [mockSongs[0], mockSongs[4]],
    createdBy: "You"
  },
  {
    id: "p2",
    name: "Workout Mix",
    description: "High energy tracks",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    songs: [mockSongs[1], mockSongs[3], mockSongs[5]],
    createdBy: "You"
  }
];

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

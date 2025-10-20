import { SongCard } from '@/components/SongCard';
import { mockSongs } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const featuredSongs = mockSongs.slice(0, 6);

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="gradient-primary p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Good evening</h1>
            {user && (
              <p className="text-primary-foreground/80">Welcome back, {user.email}</p>
            )}
          </div>
          <div className="flex gap-2">
            {user ? (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => navigate('/library')}
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-8">
        {/* Featured Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Tracks</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        {/* Popular Songs */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Right Now</h2>
          <div className="space-y-2">
            {mockSongs.slice(0, 5).map((song) => (
              <SongCard key={song.id} song={song} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

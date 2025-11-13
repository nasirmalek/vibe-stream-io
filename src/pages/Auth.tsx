import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';
import logo from '@/assets/logo.png';
import { ApiKeyDialog } from '@/components/ApiKeyDialog';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Check if API key is already set or skipped
      const hasApiKey = localStorage.getItem('youtube_api_key');
      const skipped = localStorage.getItem('youtube_api_key_skipped');
      
      if (!hasApiKey && !skipped) {
        setShowApiKeyDialog(true);
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
        // Dialog will show via useEffect
      }
    } catch (error: any) {
      toast.error('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    try {
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email to confirm.');
      }
    } catch (error: any) {
      toast.error('An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <GlowingEffect
        spread={60}
        blur={20}
        glow={true}
        disabled={false}
        proximity={100}
        inactiveZone={0.01}
        borderWidth={2}
        className="fixed inset-0 z-0"
      />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <img src={logo} alt="VibeStream" className="h-16 sm:h-20 w-auto mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to VibeStream</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Sign in to continue listening</p>
        </div>

        <div className="bg-card p-4 sm:p-6 lg:p-8 rounded-xl shadow-card">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
              <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <ApiKeyDialog 
          open={showApiKeyDialog} 
          onOpenChange={(open) => {
            setShowApiKeyDialog(open);
            if (!open) navigate('/');
          }} 
        />
      </div>
    </div>
  );
};

export default Auth;

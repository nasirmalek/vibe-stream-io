import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApiKeyDialog = ({ open, onOpenChange }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('youtube_api_key', apiKey.trim());
      toast.success('API key saved successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('youtube_api_key_skipped', 'true');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>YouTube API Key Required</DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p>To search and play songs, you need a YouTube API key.</p>
            <div className="bg-muted p-3 rounded-lg space-y-2 text-xs">
              <p className="font-semibold text-foreground">How to get an API key:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Visit Google Cloud Console</li>
                <li>Create a new project (or select existing)</li>
                <li>Enable "YouTube Data API v3"</li>
                <li>Go to Credentials and create an API key</li>
                <li>Copy and paste it here</li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">YouTube API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            asChild
          >
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Google Cloud Console
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save API Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

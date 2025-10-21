import { Home, Search, Library, Heart, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CreatePlaylistDialog } from './CreatePlaylistDialog';
import logo from '@/assets/logo.png';

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/library', icon: Library, label: 'Your Library' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <img src={logo} alt="VibeStream" className="h-12 w-auto" />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 space-y-1">
          <NavLink
            to="/liked"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <Heart className="w-5 h-5" />
            <span className="font-medium">Liked Songs</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <CreatePlaylistDialog onPlaylistCreated={() => setOpen(false)} />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header with Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <img src={logo} alt="VibeStream" className="h-8 w-auto" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col h-screen">
        <SidebarContent />
      </aside>
    </>
  );
};

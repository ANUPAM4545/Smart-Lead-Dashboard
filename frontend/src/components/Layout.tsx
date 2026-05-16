import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, LayoutDashboard, Users, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-muted/30 dark:bg-background transition-all duration-300">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} hidden md:flex flex-col m-4 mr-0 rounded-2xl bg-card border shadow-sm transition-all duration-300 relative overflow-hidden z-20`}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'px-8'} border-b border-border/50 relative z-10`}>
          <div className="flex items-center gap-3 text-primary font-bold text-2xl tracking-tight overflow-hidden">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            {!isCollapsed && <span className="animate-fade-in whitespace-nowrap">SmartLeads</span>}
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 relative z-10">
          <a href="/dashboard" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors hover:bg-primary/20`} title="Leads Dashboard">
            <Users className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="animate-fade-in whitespace-nowrap">Leads Dashboard</span>}
          </a>
        </nav>

        <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-t border-border/50 relative z-10 bg-card/50 backdrop-blur-sm`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'} mb-5`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="text-sm animate-fade-in">
                  <p className="font-semibold text-foreground truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-muted-foreground text-xs font-medium">{user?.role}</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors shrink-0"
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center ${isCollapsed ? 'p-2' : 'gap-2 px-4 py-2.5'} border border-border/50 text-muted-foreground rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-900/50 transition-all text-sm font-medium`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="animate-fade-in whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden p-4 lg:p-6">
        <header className="h-20 glass-card rounded-2xl mb-6 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Overview</h1>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto rounded-2xl pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Search, HelpCircle, User, Bell, Box, Sun, Moon, X, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';

const BackgroundParticles = dynamic(() => import('@/components/BackgroundParticles'), { ssr: false });
import ChatWidget from '@/components/ChatWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [alertOpen, setAlertOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  
  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Catalogue', href: '/dashboard/catalogue', icon: Package },
    { name: 'Tracked Bus.', href: '/dashboard/tracked', icon: Box },
    { name: 'Insights', href: '/dashboard/insights', icon: Search },
    { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
  ];

  const alertHeadlines = [
    { id: 1, title: "Price Drop Alert", summary: "ANC Headphones dropped 6.5% — Urban Tech Solutions", severity: "urgent" },
    { id: 2, title: "Sentiment Spike", summary: "Negative reviews up 22% for Apex Fitness Gear", severity: "warning" },
    { id: 3, title: "New Competitor Product", summary: "Green Leaf Organics launched Organic Tea Collection", severity: "info" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 font-sans flex flex-col md:flex-row transition-colors duration-500 relative">
      
      {/* Light-intensity background particles */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <BackgroundParticles />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md border-r border-gray-200 dark:border-white/5 flex flex-col flex-shrink-0 transition-colors duration-500 overflow-y-auto relative z-10">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-cyan-500 shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all"></div>
          <span className="font-bold text-xl tracking-tight">Bridgeloop</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium' 
                    : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
                }`}>
                  <item.icon className="w-5 h-5" suppressHydrationWarning={true} />
                  <span>{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/5 space-y-2 pb-6">
           <Link href="/dashboard/profile">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/profile' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}>
               <User className="w-5 h-5" suppressHydrationWarning={true} />
               <span>Profile Details</span>
            </div>
           </Link>

           {/* Theme Toggle — inside sidebar, not blocking header */}
           <button
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all w-full"
           >
             {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" suppressHydrationWarning={true} /> : <Moon className="w-5 h-5" suppressHydrationWarning={true} />)}
             <span>{mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme'}</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="relative z-50 h-16 border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#111111]/50 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="font-semibold text-lg">Workspace</h2>
          <div className="flex items-center space-x-4">
             {/* Alert Bell with Dropdown */}
             <div className="relative">
                <button onClick={() => setAlertOpen(!alertOpen)} className="relative cursor-pointer p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <Bell className="w-5 h-5 text-gray-500 hover:text-cyan-500 transition" suppressHydrationWarning={true} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                {alertOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <h3 className="font-bold text-sm">Notifications</h3>
                      <button onClick={() => setAlertOpen(false)}><X className="w-4 h-4 text-gray-400" suppressHydrationWarning={true} /></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {alertHeadlines.map((a) => (
                        <div key={a.id} className={`p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition ${
                          a.severity === 'urgent' ? 'border-l-4 border-l-red-500' :
                          a.severity === 'warning' ? 'border-l-4 border-l-orange-500' :
                          'border-l-4 border-l-blue-500'
                        }`}>
                          <p className="text-sm font-semibold">{a.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{a.summary}</p>
                        </div>
                      ))}
                    </div>
                    <Link href="/dashboard/insights#alerts-section">
                      <div className="p-3 text-center text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                        View All Alerts →
                      </div>
                    </Link>
                  </div>
                )}
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/80 dark:bg-black/50 transition-colors">
          {children}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}

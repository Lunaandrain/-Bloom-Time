'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const links = [
    { href: '/', label: '首页' },
    { href: '/schedule', label: '日程' },
    { href: '/garden', label: '花园' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isHome 
        ? 'bg-transparent border-transparent text-white' 
        : 'bg-white/70 backdrop-blur-md border-b border-gray-100 text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className={`font-bold text-xl ${isHome ? 'text-white drop-shadow-md' : 'text-green-700'}`}>Bloom Time</div>
        <div className="flex space-x-8">
          {links.map(link => {
            const isActive = pathname === link.href;
            let linkClass = '';
            
            if (isHome) {
              linkClass = isActive ? 'text-white font-medium drop-shadow-md' : 'text-white/70 hover:text-white drop-shadow-sm';
            } else {
              linkClass = isActive ? 'text-green-600 font-medium' : 'text-gray-500 hover:text-green-500';
            }
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`transition-colors ${linkClass}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
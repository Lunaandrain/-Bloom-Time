'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: '首页' },
    { href: '/schedule', label: '日程' },
    { href: '/garden', label: '花园' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-green-700">Bloom Time</div>
        <div className="flex space-x-8">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`transition-colors ${pathname === link.href ? 'text-green-600 font-medium' : 'text-gray-500 hover:text-green-500'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
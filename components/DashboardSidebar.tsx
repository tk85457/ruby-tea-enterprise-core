'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBoxOpen, FaLeaf, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

const DashboardSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: FaHome },
    { href: '/dashboard/products', label: 'Products', icon: FaBoxOpen },
    { href: '/dashboard/inventory', label: 'Inventory', icon: FaLeaf },
    { href: '/dashboard/stats', label: 'Performance', icon: FaChartLine },
  ];

  return (
    <aside className="w-64 bg-[var(--accent)] text-[var(--btn-text)] min-h-screen flex flex-col fixed left-0 top-0 h-full overflow-y-auto transition-colors duration-500">
      <div className="p-6 border-b border-black/10">
        <h2 className="text-2xl font-serif font-bold text-[var(--text-heading)]">Admin Panel</h2>
        <p className="text-sm opacity-60">RUBY TEA Owner</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--text-heading)] text-[var(--btn-text-hover)] font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-red-800">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <FaSignOutAlt size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

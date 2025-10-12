import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotifications(!notifications);

  // Navigation click handler: refresh page if already on that route
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (router.pathname === href) {
      e.preventDefault();
      router.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/browse"
            onClick={(e) => handleNavClick(e, "/browse")}
          >
            <img 
              src="/images/logo.png"
              alt="Marketplace"
              style={{
                width: '24px',
                height: 'auto',
                cursor: 'pointer'
              }}
            />
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/browse"
                  className="text-gray-700 hover:text-black"
                  onClick={(e) => handleNavClick(e, "/browse")}
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-gray-700 hover:text-black"
                  onClick={(e) => handleNavClick(e, "/create")}
                >
                  Create
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-black"
                  onClick={(e) => handleNavClick(e, "/profile")}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-gray-700 hover:text-black"
                  onClick={(e) => handleNavClick(e, "/settings")}
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <div className="space-y-6">
          <div className="bg-white p-6 shadow-md rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Dark Mode</h3>
                <p className="text-gray-600 text-sm">Toggle dark mode for better visibility in low light conditions.</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`px-4 py-2 rounded-full ${
                  darkMode ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {darkMode ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-gray-600 text-sm">Receive notifications for new messages and updates.</p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`px-4 py-2 rounded-full ${
                  notifications ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {notifications ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Logout</h3>
                <p className="text-gray-600 text-sm">End your session and log out of your account.</p>
              </div>
              <Link
                href="/logout"
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

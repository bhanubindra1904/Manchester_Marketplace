import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FaStar } from 'react-icons/fa';
import { Authenticator } from '@/lib/authenticator';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Filter } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  description: string;
  categoryID: string;
  image: string;
  userID: string;
  active: boolean;
  price: number;
  datecreated: string;
}

interface User {
  id: string;
  fullname: string;
  profilepicture: string;
}

interface Review {
  id: number;
  listingID: number;
  reviewerID: string;
  userID: string;
  comment: string;
  rating: number;
}

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string | null>(null);
  const [currentListings, setCurrentListings] = useState<Listing[]>([]);
  const [pastListings, setPastListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedTab, setSelectedTab] = useState<'current' | 'previous'>('current');

  // Navigation click handler: refresh page if already on that route
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (router.pathname === href) {
      e.preventDefault();
      router.reload();
    }
  };

  useEffect(() => {
    document.title = 'Profile';
    Authenticator.validateUser();
    const urlParams = new URLSearchParams(window.location.search);
    setId(urlParams.get('username'));
    setFullname(urlParams.get('fullname'));
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error: fetchError } = await supabase
          .from('User')
          .select()
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;
        setUser(userData);
      } catch (error) {
        console.error('Supabase error:', error);
      }
    };
    if (id) fetchUser();
  }, [id]);

  // Fetch listings data
  useEffect(() => {
    const fetchListings = async (active: boolean) => {
      try {
        const { data: listings, error: fetchError } = await supabase
          .from('Listing')
          .select()
          .eq('userID', id)
          .eq('active', active);
        if (fetchError) throw fetchError;
        return listings || [];
      } catch (error) {
        console.error('Supabase error:', error);
        return [];
      }
    };

    const getListings = async () => {
      if (id) {
        const activeListings = await fetchListings(true);
        const inactiveListings = await fetchListings(false);
        setCurrentListings(activeListings);
        setPastListings(inactiveListings);
      }
    };
    getListings();
  }, [id]);

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: reviews, error: fetchError } = await supabase
          .from('Review')
          .select();
        if (fetchError) throw fetchError;
        setReviews(reviews || []);
      } catch (error) {
        console.error('Supabase error:', error);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  return (
    <div className="min-h-screen bg-white font-sans">
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
        {/* Profile Header */}
        <div className="mb-8">
          <h1 style={{ fontSize: '48px', fontFamily: 'newsreader', lineHeight: '1.5' }}>
            {user?.fullname}
          </h1>
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-purple-600 mr-1" />
            ))}
          </div>
        </div>

        {/* Listings Header & Tab Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-md rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Listings</h2>
              <div className="flex gap-2">
                <button className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <Filter className="w-4 h-4 mr-2" /> Sort
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${
                    selectedTab === 'current'
                      ? 'bg-black text-white'
                      : 'bg-gray-200'
                  }`}
                  onClick={() => setSelectedTab('current')}
                >
                  Current
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${
                    selectedTab === 'previous'
                      ? 'bg-black text-white'
                      : 'bg-gray-200'
                  }`}
                  onClick={() => setSelectedTab('previous')}
                >
                  Previous
                </button>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedTab === 'current' ? currentListings : pastListings).map((listing) => (
                <Link
                  // Replace "profile" with "product" in the URL path
                  href={window.location.href.replace('profile', `product/${listing.id}`)}
                  key={listing.id}
                  className="no-underline"
                >
                  <div className="bg-white p-6 rounded-lg shadow">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-2">{listing.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">${listing.price}</span>
                      <button
                        className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          // handleDeleteListing(listing.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

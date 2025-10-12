import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Authenticator } from "@/lib/authenticator";
import { supabase } from "../lib/supabase";
import { Filter } from "lucide-react";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function Browse() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Navigation click handler: refresh page if already on that route
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (router.pathname === href) {
      e.preventDefault();
      router.reload();
    }
  };

  useEffect(() => {
    document.title = "Browse";
    Authenticator.validateUser();
    fetchListings();
  }, []);

  useEffect(() => {
    setFilteredListings(
      listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedCategory === "All" ||
            listing.description.includes(selectedCategory))
      )
    );
  }, [searchTerm, listings, selectedCategory]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase.from("Listing").select("*");
      if (error) throw error;
      setListings(data || []);
      setFilteredListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
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

      {/* Main Content Container */}
      <div className="w-full mt-20">
        <h1 style={{ fontSize: '36px', fontFamily: 'newsreader', lineHeight: '1.1', textAlign: 'center', marginBottom: '0.5rem' }}>
          The marketplace for <i>students</i>, by <i>students.</i>
        </h1>
        <p style={{ color: "gray", fontSize: "18px", textAlign: 'center', marginBottom: '2.5rem' }}>
          List your items for sale amongst verified students.
        </p>
        <div className="w-full max-w-6xl mx-auto bg-white p-6 shadow-md rounded-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <button className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              <Filter className="w-4 h-4 mr-2" /> Sort
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "All"
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {["Electronics", "Books", "Clothing", "Furniture"].map(
              (cat, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-lg w-full mb-6"
          />

          {loading ? (
            <p className="text-center text-gray-500">Loading listings...</p>
          ) : filteredListings.length === 0 ? (
            <p className="text-center text-gray-500">No listings available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{listing.description}</p>
                  <p className="font-bold text-gray-900 mt-2">
                    ${listing.price}
                  </p>
                  <button
                    onClick={() => router.push(`/product/${listing.id}`)}
                    className="mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

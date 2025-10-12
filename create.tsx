import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import { useEffect } from 'react';
import { nanoid } from "nanoid";
import { Authenticator } from '@/lib/authenticator';
import Link from "next/link";
import { handleNavClick } from '@/lib/authenticator';

const CreateListingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [product, setProduct] = useState({
    image: null as File | null,
    imageUrl: "",
    name: "",
    description: "",
    price: "",
    tags: "",
    active: true,
  });

  useEffect(() => {
    document.title = "Create";
    Authenticator.validateUser();
    const urlParams = new URLSearchParams(window.location.search);
    setId(urlParams.get('username'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProduct({ ...product, image: file, imageUrl: URL.createObjectURL(file) });
    }
  };

  // File upload to bucket

  const handleUpload = async (file: File) => {
    try {
      if (!file || !id) {
        throw new Error('File and user ID are required');
      }
  
      const filename = `${id}_${nanoid()}.${file.name.split('.').pop()}`;
  
      const { data, error } = await supabase.storage
        .from("listingImage")
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (error) {
        throw error;
      }
  
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("listingImage")
        .getPublicUrl(filename);
  
      return publicUrlData.publicUrl;
  
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!product.image) {
        throw new Error('Please select an image');
      }
      const imageUrl = await handleUpload(product.image);
      const { data, error } = await supabase
        .from('Listing')
        .insert([
          {
            title: product.name,
            description: product.description,
            userID: id,
            categoryID: "test",
            active: true,
            price: product.price,
            image: imageUrl // Store the public URL of the image
          }
        ])
        .select();


      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Product added successfully:', data);
      router.push('/browse');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create listing';
      console.error('Error details:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      <main className="mt-20">
        <div className="w-full">
          <div className="w-full max-w-2xl mx-auto bg-white p-6 shadow-md rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a Listing</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {product.imageUrl && (
              <img src={product.imageUrl} alt="Preview" className="w-full h-48 object-cover mb-4 rounded-lg" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="image" className="block font-medium text-gray-700">Product Image</label>
                <input type="file" id="image" name="image" className="mt-1 w-full border p-2 rounded-md" onChange={handleFileChange} />
              </div>

              <div>
                <label htmlFor="name" className="block font-medium text-gray-700">Product Name</label>
                <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required />
              </div>

              <div>
                <label htmlFor="description" className="block font-medium text-gray-700">Product Description</label>
                <textarea id="description" name="description" value={product.description} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required />
              </div>

              <div>
                <label htmlFor="price" className="block font-medium text-gray-700">Product Price</label>
                <input type="number" id="price" name="price" value={product.price} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required />
              </div>

              <div>
                <label htmlFor="tags" className="block font-medium text-gray-700">Tags (comma separated)</label>
                <input type="text" id="tags" name="tags" value={product.tags} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" />
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Submit Listing'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateListingPage;

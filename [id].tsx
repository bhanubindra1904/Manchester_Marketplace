import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { Authenticator } from '@/lib/authenticator';

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

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Authenticator.validateUser();

        const fetchListing = async () => {
            if (!id) return;

            try {
                const { data, error: fetchError } = await supabase
                    .from('Listing')
                    .select()
                    .eq('id', id)
                    .single();

                if (fetchError) throw fetchError;
                if (!data.active) {
                    setError('This product is no longer available');
                    return;
                }
                setListing(data);
            } catch (error) {
                console.error('Supabase error:', error);
                setError('Failed to fetch listing');
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
    if (!listing) return <div className="text-center mt-10">Listing not found</div>;

    document.title = listing?.title || "View";

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <header className="w-full flex justify-between items-center mb-6">
                <input 
                    type="search" 
                    placeholder="Search for products..." 
                    aria-label="Search"
                    className="p-2 rounded-lg border border-gray-300 w-1/3"
                />
                <nav className="flex gap-4">
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">Profile</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">Account</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">Wishlist</button>
                    <button className="px-4 py-2 bg-black text-white rounded-lg">Create</button>
                </nav>
            </header>

            <main className="w-full flex gap-8">
                <aside className="w-1/2 bg-white p-6 shadow-lg rounded-xl flex items-center justify-center">
                    <img src={listing.image || "/placeholder.png"} alt={listing.title} className="w-full h-auto max-h-96 object-cover rounded-lg" />
                </aside>

                <section className="w-1/2 bg-white p-6 shadow-lg rounded-xl">
                    <h1 className="text-3xl font-semibold">{listing.title}</h1>
                    <p className="text-xl text-gray-700 mt-2">£{listing.price}</p>
                    <div className="mt-4 flex gap-4">
                        <button className="px-6 py-2 bg-black text-white rounded-lg">Request</button>
                        <button className="px-6 py-2 bg-gray-200 rounded-lg">Save</button>
                        <button className="px-6 py-2 bg-red-200 rounded-lg">⚠️</button>
                    </div>
                    <p className="mt-6 text-gray-600">{listing.description}</p>
                </section>
            </main>
        </div>
    );
}
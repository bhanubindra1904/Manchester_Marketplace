import Link from 'next/link';
import { useEffect } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  useEffect(() => {
    // Prevent scrolling on mount
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Cleanup on unmount
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      backgroundColor: '#fafafa'
    }}>
      {/* Logo Container */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 50,
        padding: '0.5rem'
      }}>
        <Link href="/">
          <img 
            src="/images/logo.png"
            alt="Marketplace"
            style={{
              width: '32px',
              height: 'auto',
              cursor: 'pointer'
            }}
          />
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ 
        padding: '10rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ fontSize: '52px', fontFamily: 'newsreader', lineHeight: '1.1' }}>
          The marketplace for <i>students</i>,<br />
          by <i>students.</i>
        </h1>
        <h2 style={{ color: "gray", fontSize: "18px" }} className={inter.className}>
          <br/>List your items for sale amongst verified students.
        </h2>
        <Link
          href="/browse"
          style={{
            fontSize: "18px",
            marginTop: '1rem',
            padding: '0.7rem 1.2rem',
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontFamily: inter.style.fontFamily
          }}
        >
          Login
        </Link>
      </div>

      {/* Grid Squares */}
      <div style={{
        position: 'relative',
        marginTop: '-5rem',
        paddingBottom: '4rem',
        paddingRight: '8rem',
        paddingLeft: '8rem',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          padding: '0 1rem',
          transform: 'translateY(0%)'
        }}>
          {[...Array(16)].map((_, i) => (
            <div key={i} style={{
              width: '100%',
              aspectRatio: '4/3',
              backgroundColor: 'white',
              borderRadius: '10px',
              //boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '2px solid rgb(235, 235, 235)'
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};
import { useEffect } from 'react';
import { Authenticator } from '@/lib/authenticator';

export default function Search() {

  useEffect(() => {
    Authenticator.validateUser();
  }, []);

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
};
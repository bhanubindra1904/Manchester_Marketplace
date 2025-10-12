import { useEffect } from 'react';
import { Authenticator } from '@/lib/authenticator';

export default function Logout() {

  useEffect(() => {
    Authenticator.invalidateUser();
  }, []);

  return;
};
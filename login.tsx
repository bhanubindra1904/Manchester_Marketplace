import { useEffect } from 'react';
import { Authenticator } from '@/lib/authenticator';

export default function Login() {

  useEffect(() => {
    Authenticator.validateUser();
  }, []);

  return;
};
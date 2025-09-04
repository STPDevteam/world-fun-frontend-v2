import { useState, useCallback } from 'react';
import { useSignMessage } from 'wagmi';
import { API_URL } from '@/constants'


export function useMySignature() {
  const [isLoading, setIsLoading] = useState(false);
  const { signMessageAsync } = useSignMessage();

  // 
  const getOrRequestSignature = useCallback(async () => {
    try {
      let signature = localStorage.getItem('Signature');
      
      if (!signature) {
        const message = 'Welcome to Autonomous World.';
        signature = await signMessageAsync({ message });
        localStorage.setItem('Signature', signature);
        localStorage.setItem('Signaturemsg', message);
      }
      
      return signature;
    } catch (error) {
      console.error('Signature error:', error);
      throw error;
    }
  }, [signMessageAsync]);

  // 
  const callApiWithSignature = useCallback(async (endpoint: any, options: any = {}) => {
    setIsLoading(true);
    try {
      const signature = await getOrRequestSignature();
      const address = localStorage.getItem('address');
      const signaturemsg = localStorage.getItem('Signaturemsg');

      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Address': address,
          'Signature': signature,
          'Signaturemsg': signaturemsg,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getOrRequestSignature]);

  return {
    isLoading,
    getOrRequestSignature,
    callApiWithSignature,
  };
}
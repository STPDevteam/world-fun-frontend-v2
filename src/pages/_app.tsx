import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Provider } from "@/components/ui/provider";
import { config } from '@/config/rainbow.config';
import '@rainbow-me/rainbowkit/styles.css';
import '@/styles/globals.css';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const restrictedCountries = ['AF', 'BY', 'MM', 'CF', 'CU', 'CD', 'ET', 'IR', 'IQ', 'LB', 'LY', 'ML', 'NI', 'KP', 'SO', 'SD', 'SS', 'SY', 'VE', 'YE', 'ZW', 'RU', 'UA'];
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    async function checkUserRegion() {
      const api = 'https://api.ipgeolocation.io/ipgeo?apiKey=6500ed3584e74d3eadd57b82e148ed03';

        try {
          const response = await fetch(api, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const userCountry = data.country_code2; // Handle different API response formats
          setIsRestricted(restrictedCountries.includes(userCountry));
          setIsLoading(false);
          return; // Exit after successful fetch
        } catch (error) {
          console.error(`Error fetching geolocation from ${api}:`, error);
        }

      // Fallback: Assume not restricted if all APIs fail
      console.warn('All geolocation APIs failed, allowing access.');
      setIsRestricted(false);
      setIsLoading(false);
    }

    checkUserRegion();
  }, []);

  if (isRestricted) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '24px' }}>
        The service is not available in your region.
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>World.fun</title>
        <meta name="description" content="World.Fun" />
      </Head>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            locale="en-US"
            theme={darkTheme({
              accentColor: "#0E76FD",
              accentColorForeground: "white",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <Provider>
              <Component {...pageProps} />
            </Provider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
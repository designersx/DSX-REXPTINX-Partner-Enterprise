
import type { Metadata } from 'next';
import './globals.css';
import ProviderWrapper from './ProviderWrapper';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Rexpt',
  description:
    'AI Receptionist Service.'
};

export default function RootLayout({ children }: { children: React.ReactElement }) {

  return (
    <html lang="en">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>


      
      <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`}
          async
          defer
        ></script>
    </html>
  );
}

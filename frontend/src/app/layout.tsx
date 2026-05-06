import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/CartProvider';
import { WishlistProvider } from '@/components/WishlistProvider';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: 'ÉLÉVATION | Premium Fashion',
  description: 'Experience luxury fashion redefined. Curated collections for the discerning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <CustomCursor />
              {children}
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import { Metadata } from 'next';
import ClientProviders from './components/ClientProviders';
import "./globals.css";
export const metadata: Metadata = {
  applicationName: "PWA App",
  title: {
    default: "Our Awesome Quiz App",
    template: "%s - PWA App",
  },
  description: "Best PWA app in the world!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Our Awesome Quiz App",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "PWA App",
    title: {
      default: "My Awesome PWA App",
      template: "%s - PWA App",
    },
    description: "Best PWA app in the world!",
  },
  twitter: {
    card: "summary",
    title: {
      default: "My Awesome PWA App",
      template: "%s - PWA App",
    },
    description: "Best PWA app in the world!",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

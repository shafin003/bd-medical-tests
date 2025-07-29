import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = {
	title: 'MediTest BD - Medical Test Price Comparison',
	description: 'Find and compare medical test prices across hospitals in Bangladesh. Make informed decisions for your healthcare needs.',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
				<Header />
				<main className="flex-grow">{children}</main>
				<Footer />
				<Toaster />
			</body>
		</html>
	);
}

import '../styles/globals.css';

export const metadata = {
  title: 'PATHWAY',
  description: 'Interactive browser novel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <main>{children}</main>
      </body>
    </html>
  );
}

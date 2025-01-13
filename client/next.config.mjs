/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/uploads/:path*',
            destination: 'http://localhost:3000/uploads/:path*', // Прокси на сервер 3000
          },
        ]
      },
};

export default nextConfig;
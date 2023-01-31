/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // webpack: (config,options) => {
  //   if(!options.dev) config.module.rules.push({
  //     test:/\.json$/,
  //     loader: 'json-loader'
  //   })
  //   return config
  // }

}

module.exports = nextConfig

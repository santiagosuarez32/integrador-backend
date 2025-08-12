// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" }, // si usás Unsplash
    ],
  },
};

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FreeFalastin Shop",
    short_name: "FreeFalastin",
    description:
      "Solidarität tragen & Hoffnung schenken. Offizieller FreeFalastin Shop.",
    start_url: "/",
    display: "standalone",
    background_color: "#064e3b",
    theme_color: "#064e3b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}

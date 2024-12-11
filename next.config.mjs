// /** @type {import('next').NextConfig} */

// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "example.com",
//             }
//         ]
//     }
// };

// import withNextIntl from 'next-intl/plugin';

// export default withNextIntl("./i18n.ts")(nextConfig);



// Import the Next.js Internationalization plugin
import withNextIntl from "next-intl/plugin";

// Define the Next.js configuration
const nextConfig = {};

// Export the configuration wrapped with the Internationalization plugin
export default withNextIntl("./i18n.ts")(nextConfig);
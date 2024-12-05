/** @type {import('next').NextConfig} */

const nextConfig = {};

import withNextIntl from 'next-intl/plugin';

export default withNextIntl("./i18n.ts")(nextConfig);

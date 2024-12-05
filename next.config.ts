import type { NextConfig } from 'next';

const nextConfig = {};

const withNextIntl = require('next-intl/plugin')("./i18n.ts");

module.exports = withNextIntl(nextConfig);

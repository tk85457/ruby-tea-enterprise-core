import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rubytea.in';

  // In a real enterprise app, fetch these from DB
  const dynamicRoutes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/products/classic-ruby-tea',
    '/products/elaichi-ruby-tea',
    '/products/masala-ruby-tea',
    '/products/green-ruby-tea',
    '/products/herbal-ruby-infusion',
  ];

  return dynamicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}

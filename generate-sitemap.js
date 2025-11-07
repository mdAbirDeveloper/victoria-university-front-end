import { writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';

const sitemap = new SitemapStream({ hostname: 'https://cumilla-victoria.vercel.app/' });

const urls = ['', '/components/student/attendance', '/components/student/profile', '/components/teacher/profile', '/components/teacher/ganerateToken', '/components/teacher/allStudents', '/components/teacher/attendance', '/components/student/signup',];

urls.forEach((url) => {
  sitemap.write({ url, changefreq: 'monthly', priority: 0.8 });
});

sitemap.end();

streamToPromise(sitemap).then((sm) => {
  writeFileSync('public/sitemap.xml', sm.toString());
  console.log('Sitemap generated!');
});

import type { MetadataRoute } from 'next';
import { getAllFromICIds, getAllRoutePairs } from '../lib/highway';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nextjs-practice-01-beige.vercel.app';
  const lastModified = new Date();

  // トップページ
  const top = {
    url: baseUrl,
    lastModified,
  };

  // 一覧ページ
  const list = {
    url: `${baseUrl}/highway`,
    lastModified,
  };

  // 中間ページ（出発IC別）
  const fromPages = getAllFromICIds().map((from) => ({
    url: `${baseUrl}/highway/${from}`,
    lastModified,
  }));

  // 詳細ページ（順方向29ルート）
  const detailPages = getAllRoutePairs().map(({ from, to }) => ({
    url: `${baseUrl}/highway/${from}/${to}`,
    lastModified,
  }));

  return [top, list, ...fromPages, ...detailPages];
}
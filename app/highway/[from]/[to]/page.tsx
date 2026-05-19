import { Breadcrumb } from '@/components/Breadcrumb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ics,
  getICById,
  getRoute,
  getRoutesFrom,
  getAllRoutePairs,
  calcDiscountedFare,
} from '@/lib/highway';
import { FareTabs } from '@/components/highway/FareTabs';
import styles from './page.module.css';

// ============================================
// 型定義：URLパラメータの形
// ============================================
type Params = {
  from: string;
  to: string;
};

// ============================================
// 1. generateStaticParams：ビルド時に静的生成するURLパターンを宣言
// ============================================
export function generateStaticParams(): Params[] {
  // lib/highway.ts の getAllRoutePairs() が 29 ペア（順方向のみ）を返す
  return getAllRoutePairs();
}

// ============================================
// 2. generateMetadata：各ページのタイトル・description を動的生成
// ============================================
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { from, to } = await params;
  const fromIC = getICById(from);
  const toIC = getICById(to);

  if (!fromIC || !toIC) {
    return { title: 'ルートが見つかりません' };
  }

  // canonical URL：このページのURLそのもの
  // 逆方向ページは存在しないので、重複排除のための並べ替えは不要
  const canonicalPath = `/highway/${from}/${to}`;

  return {
    title: `${fromIC.name} → ${toIC.name}`,
    description: `${fromIC.name}IC（${fromIC.road}）から${toIC.name}IC（${toIC.road}）までの高速道路料金・距離を確認できます。`,
    alternates: {
      canonical: canonicalPath,
    },
  };
}

// ============================================
// 3. ページ本体
// ============================================
export default async function RoutePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { from, to } = await params;

  // 不正なパラメータチェック
  if (from === to) {
    notFound();
  }

  const fromIC = getICById(from);
  const toIC = getICById(to);
  const route = getRoute(from, to);

  if (!fromIC || !toIC || !route) {
    notFound();
  }

  const discountedFare = calcDiscountedFare(route.etc);

  // 関連ルート：同じ from で、現在見ているルート以外
  const relatedRoutes = getRoutesFrom(from).filter((r) => r.to !== to);

  return (
    <div className={styles.page}>
      {/* パンくず */}
      <Breadcrumb
        items={[
          { label: '一覧', href: '/highway' },
          { label: `${fromIC.name}IC発`, href: `/highway/${from}` },
          { label: `${fromIC.name} → ${toIC.name}` },
        ]}
      />

      {/* ルートヘッダー */}
      <header className={styles.routeHeader}>
        <div className={styles.routeIc}>
          <div className={styles.icName}>{fromIC.name}</div>
          <div className={styles.icRoad}>{fromIC.road}</div>
        </div>
        <div className={styles.routeArrow}>→</div>
        <div className={styles.routeIc}>
          <div className={styles.icName}>{toIC.name}</div>
          <div className={styles.icRoad}>{toIC.road}</div>
        </div>
      </header>

      {/* 料金タブUI（クライアントコンポーネント） */}
      <section className={styles.fareSection}>
        <FareTabs etc={route.etc} discounted={discountedFare} />
      </section>

      {/* メタ情報 */}
      <section className={styles.metaSection}>
        <dl className={styles.metaList}>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>距離</dt>
            <dd className={styles.metaValue}>{route.distance_km} km</dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>出発IC</dt>
            <dd className={styles.metaValue}>
              {fromIC.name}IC<span className={styles.metaSub}>（{fromIC.description}）</span>
            </dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>到着IC</dt>
            <dd className={styles.metaValue}>
              {toIC.name}IC<span className={styles.metaSub}>（{toIC.description}）</span>
            </dd>
          </div>
        </dl>
      </section>

      {/* 関連ルート（同じ出発地） */}
      {relatedRoutes.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>
            {fromIC.name}発の他のルート
          </h2>
          <ul className={styles.relatedList}>
            {relatedRoutes.map((r) => {
              const relatedToIC = getICById(r.to);
              if (!relatedToIC) return null;
              return (
                <li key={r.to} className={styles.relatedItem}>
                  <Link
                    href={`/highway/${r.from}/${r.to}`}
                    className={styles.relatedLink}
                  >
                    <span className={styles.relatedRouteName}>
                      {fromIC.name} → {relatedToIC.name}
                    </span>
                    <span className={styles.relatedFare}>
                      ETC {r.etc.toLocaleString()}円
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
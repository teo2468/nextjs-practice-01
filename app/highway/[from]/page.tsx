import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getICById,
  getAllFromICIds,
  getRoutesFrom,
} from '@/lib/highway';
import styles from './page.module.css';

// ============================================
// 型定義：URLパラメータの形
// ============================================
type Params = {
  from: string;
};

// ============================================
// 1. generateStaticParams：出発IC 分の静的ページを生成
// ============================================
export function generateStaticParams(): Params[] {
  // 現状：takasaki, tokorozawa, iruma の 3 個
  return getAllFromICIds().map((id) => ({ from: id }));
}

// ============================================
// 2. generateMetadata：各ページのタイトル・description を動的生成
// ============================================
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { from } = await params;
  const fromIC = getICById(from);

  if (!fromIC) {
    return { title: 'IC が見つかりません' };
  }

  return {
    title: `${fromIC.name}IC から行ける目的地一覧`,
    description: `${fromIC.name}IC（${fromIC.road}）を出発地とする高速道路ルート一覧。料金・距離を確認できます。`,
    alternates: {
      canonical: `/highway/${from}`,
    },
  };
}

// ============================================
// 3. ページ本体
// ============================================
export default async function FromICPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { from } = await params;
  const fromIC = getICById(from);

  if (!fromIC) {
    notFound();
  }

  // この出発IC から行ける全ルートを取得
  const routes = getRoutesFrom(from);

  // ルートが 1 つもない場合は 404
  if (routes.length === 0) {
    notFound();
  }

  return (
    <div className={styles.page}>
      {/* パンくず */}
      <nav className={styles.breadcrumb}>
        <Link href="/highway" className={styles.breadcrumbLink}>
          一覧
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{fromIC.name}</span>
      </nav>

      {/* IC ヘッダー */}
      <header className={styles.icHeader}>
        <h1 className={styles.icName}>{fromIC.name}IC</h1>
        <p className={styles.icRoad}>{fromIC.road}</p>
        <p className={styles.icDescription}>{fromIC.description}</p>
      </header>

      {/* 目的地一覧 */}
      <section className={styles.destinationSection}>
        <h2 className={styles.sectionTitle}>
          {fromIC.name}IC から行ける目的地
        </h2>
        <ul className={styles.destinationList}>
          {routes.map((route) => {
            const toIC = getICById(route.to);
            if (!toIC) return null;

            return (
              <li key={route.to} className={styles.destinationItem}>
                <Link
                  href={`/highway/${from}/${route.to}`}
                  className={styles.destinationLink}
                >
                  <div className={styles.destinationName}>
                    {toIC.name}IC
                  </div>
                  <div className={styles.destinationMeta}>
                    <span>{toIC.road}</span>
                    <span className={styles.destinationDistance}>
                      {route.distance_km} km
                    </span>
                    <span className={styles.destinationFare}>
                      ETC ¥{route.etc.toLocaleString()}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
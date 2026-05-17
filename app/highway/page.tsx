import Link from 'next/link';
import { ics, routes, getICById, type Route } from '@/lib/highway';
import styles from './page.module.css';

// 出発点ICのIDリスト（高崎・所沢・入間の3つ）
const ORIGIN_IDS = ['takasaki', 'tokorozawa', 'iruma'];

export default function HighwayIndexPage() {
  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>関東圏 高速道路料金シミュレーター</h1>
        <p className={styles.subtitle}>
          高崎・所沢・入間を起点とした主要目的地への高速道路料金を一覧で確認できます。
        </p>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <strong>{ics.length}</strong> IC
          </span>
          <span className={styles.statItem}>
            <strong>{routes.length * 2}</strong> ルート
          </span>
        </div>
      </section>

      {ORIGIN_IDS.map((originId) => {
        const origin = getICById(originId);
        if (!origin) return null;

        // この出発点を含むルートをフィルタ
        const relatedRoutes: Route[] = routes.filter(
          (r) => r.from === originId || r.to === originId
        );

        return (
          <section key={originId} className={styles.originSection}>
            <h2 className={styles.originTitle}>
              <span className={styles.originName}>{origin.name}</span>
              <span className={styles.originRoad}>{origin.road}</span>
              <span className={styles.originCount}>
                {relatedRoutes.length}ルート
              </span>
            </h2>

            <div className={styles.cardGrid}>
              {relatedRoutes.map((route) => {
                // originId 側を from とする方向に正規化（表示用）
                const fromId = originId;
                const toId =
                  route.from === originId ? route.to : route.from;
                const destination = getICById(toId);
                if (!destination) return null;

                return (
                  <Link
                    key={`${fromId}-${toId}`}
                    href={`/highway/${fromId}/${toId}`}
                    className={styles.card}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.cardArrow}>→</span>
                      <span className={styles.cardDest}>
                        {destination.name}
                      </span>
                    </div>
                    <p className={styles.cardDescription}>
                      {destination.description}
                    </p>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardFare}>
                        ¥{route.etc.toLocaleString()}
                      </span>
                      <span className={styles.cardDistance}>
                        {route.distance_km}km
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
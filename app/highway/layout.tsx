import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './layout.module.css';

// ============================================
// メタデータ：noindex/nofollow を一括設定
// ============================================
export const metadata: Metadata = {
  title: {
    template: '%s | 高速道路料金シミュレーター',
    default: '高速道路料金シミュレーター',
  },
  description: '関東圏の主要IC間の高速道路料金を一覧で確認できます。',
  robots: {
    index: false,
    follow: false,
  },
};

// ============================================
// レイアウト本体
// ============================================
export default function HighwayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/highway" className={styles.brand}>
          高速道路料金シミュレーター
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            ← トップに戻る
          </Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.note}>
          ※ 表示料金は普通車のETC料金です。実際の料金は変動する場合があります。
        </p>
        <p className={styles.note}>
          ※ 休日・深夜割引はNEXCO基本ルール（ETC料金×0.7）で計算しています。首都高接続部など割引対象外区間がある場合は実際と異なります。
        </p>
      </footer>
    </div>
  );
}
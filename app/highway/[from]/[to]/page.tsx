import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>nextjs-practice-01</h1>
          <p className={styles.subtitle}>Next.js学習用サンドボックス</p>
        </header>

        <div className={styles.divider} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>実装中のもの</h2>

          <Link href="/highway" className={styles.card}>
            <div className={styles.cardIcon}>🛣</div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>高速道路料金シミュレーター</h3>
              <p className={styles.cardDescription}>
                関東圏のICから目的地までの料金を素早く確認
              </p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>
        </section>
      </div>
    </main>
  );
}
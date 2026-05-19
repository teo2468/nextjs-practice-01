import Link from 'next/link';
import styles from './Breadcrumb.module.css';

// ============================================
// 型定義：パンくず1項目の形
// ============================================
export type BreadcrumbItem = {
  label: string;   // 表示テキスト
  href?: string;   // リンク先（最後の項目は href なしで現在地）
};

// ============================================
// プロパティ
// ============================================
type Props = {
  items: BreadcrumbItem[];
};

// ============================================
// 共通パンくずコンポーネント
// href があればリンク、なければ現在地として表示
// ============================================
export function Breadcrumb({ items }: Props) {
  return (
    <nav className={styles.breadcrumb} aria-label="パンくずリスト">
      {items.map((item, index) => (
        <span key={index} className={styles.item}>
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className={styles.sep}>/</span>
          )}
        </span>
      ))}
    </nav>
  );
}
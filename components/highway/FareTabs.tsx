'use client';

import { useState } from 'react';
import styles from './FareTabs.module.css';

// ============================================
// Props（親から渡される値）の型定義
// ============================================
type Props = {
  etc: number;        // 通常ETC料金
  discounted: number; // 休日・深夜割引後料金（ETC × 0.7）
};

// タブの種類を表す型（'etc' または 'discounted' のどちらか）
type TabKey = 'etc' | 'discounted';

// ============================================
// コンポーネント本体
// ============================================
export function FareTabs({ etc, discounted }: Props) {
  // 現在選択中のタブを state で管理（初期値は 'etc'）
  const [activeTab, setActiveTab] = useState<TabKey>('etc');

  // 表示する料金（選択中のタブに応じて切替）
  const displayFare = activeTab === 'etc' ? etc : discounted;
  const savings = etc - discounted; // 割引額（参考表示用）

  return (
    <div className={styles.container}>
      {/* タブボタン */}
      <div className={styles.tabBar} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'etc'}
          className={`${styles.tab} ${activeTab === 'etc' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('etc')}
        >
          ETC
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'discounted'}
          className={`${styles.tab} ${activeTab === 'discounted' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('discounted')}
        >
          休日・深夜割引
        </button>
      </div>

      {/* 料金表示 */}
      <div className={styles.fareDisplay}>
        <div className={styles.fareLabel}>
          {activeTab === 'etc' ? 'ETC料金（普通車）' : '休日・深夜割引適用時'}
        </div>
        <div className={styles.fareAmount}>
          <span className={styles.fareYen}>¥</span>
          <span className={styles.fareNumber}>
            {displayFare.toLocaleString()}
          </span>
        </div>
        {activeTab === 'discounted' && (
          <div className={styles.fareSavings}>
            通常ETC料金より ¥{savings.toLocaleString()} お得
          </div>
        )}
      </div>

      {/* 注意書き */}
      {activeTab === 'discounted' && (
        <p className={styles.note}>
          ※ 休日割引（土日祝の終日）または深夜割引（0:00-4:00）に該当する場合の料金です。首都高接続部など割引対象外区間がある場合は実際と異なります。
        </p>
      )}
    </div>
  );
}
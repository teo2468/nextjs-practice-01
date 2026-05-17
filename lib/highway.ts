import icDataRaw from '../data/ic.json';
import routeDataRaw from '../data/route.json';

// ============================================
// 型定義
// ============================================

/**
 * IC（インターチェンジ）1個分のデータ構造
 */
export type IC = {
  id: string;          // URLに使う英語ID（例: "takasaki"）
  name: string;        // 表示名（例: "高崎"）
  kana: string;        // カタカナ表記（例: "タカサキ"）
  road: string;        // 路線名（例: "E17 関越道"）
  description: string; // 説明文（例: "群馬県・関越道の主要IC"）
};

/**
 * ルート1ペア分のデータ構造
 */
export type Route = {
  from: string;        // 出発ICのid
  to: string;          // 目的ICのid
  etc: number;         // ETC料金（円）
  distance_km: number; // 距離（km）
};

// ============================================
// データのエクスポート（型を当てて再エクスポート）
// ============================================

export const ics: IC[] = icDataRaw;
export const routes: Route[] = routeDataRaw;

// ============================================
// 検索系ヘルパー関数
// ============================================

/**
 * IDからIC情報を取得する
 * 見つからない場合は undefined を返す
 */
export function getICById(id: string): IC | undefined {
  return ics.find((ic) => ic.id === id);
}

/**
 * from と to のIDからルート情報を取得する
 * 双方向対応：A→B が登録されていれば B→A もヒットする
 */
export function getRoute(from: string, to: string): Route | undefined {
  return routes.find(
    (r) =>
      (r.from === from && r.to === to) ||
      (r.from === to && r.to === from)
  );
}

/**
 * 全ルートを双方向に展開した配列を返す
 * 元データの29ペアを 29×2 = 58 ペアに展開
 * generateStaticParams で使う
 */
export function getAllRoutePairs(): { from: string; to: string }[] {
  const pairs: { from: string; to: string }[] = [];
  for (const r of routes) {
    pairs.push({ from: r.from, to: r.to });
    pairs.push({ from: r.to, to: r.from });
  }
  return pairs;
}

// ============================================
// 料金計算関数
// ============================================

/**
 * 休日・深夜割引後の料金を計算する
 * NEXCO基本ルール：ETC料金 × 0.7（30%引）
 * ただし首都高接続部などは割引対象外区間があるため、表示時に注意書きが必要
 */
export function calcDiscountedFare(etc: number): number {
  return Math.round(etc * 0.7);
}
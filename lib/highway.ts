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
 * 順方向のみ対応（B→A は別ルートとして扱わない）
 */
export function getRoute(from: string, to: string): Route | undefined {
  return routes.find((r) => r.from === from && r.to === to);
}

/**
 * 全ルート（順方向のみ）の配列を返す
 * routes.json の 29 ルートをそのまま generateStaticParams 用の形に変換
 */
export function getAllRoutePairs(): { from: string; to: string }[] {
  return routes.map((r) => ({ from: r.from, to: r.to }));
}

// ============================================
// 中間ページ用ヘルパー
// ============================================

/**
 * 出発側に登場する全 IC の id 配列を返す
 * 中間ページ /highway/[from] の generateStaticParams で使う
 * 現状：takasaki, tokorozawa, iruma の 3 個
 */
export function getAllFromICIds(): string[] {
  // Set で重複排除してから配列に戻す
  const ids = new Set(routes.map((r) => r.from));
  return Array.from(ids);
}

/**
 * 指定された出発IC から行ける全ルートを返す
 * 中間ページの本文で「目的地一覧」を表示するのに使う
 */
export function getRoutesFrom(fromId: string): Route[] {
  return routes.filter((r) => r.from === fromId);
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
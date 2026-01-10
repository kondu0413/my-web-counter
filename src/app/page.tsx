/**
 * 【このファイルについて】
 * このファイルは、Webページのメイン画面を表示するコンポーネントです。
 * カウンターアプリの機能（数を増やす、リセット）を実装しています。
 */

// 'use client' は、このコンポーネントがブラウザ側（クライアント側）で動作することを示します
// Next.jsでは、ユーザーの操作（ボタンクリックなど）を扱うコンポーネントには必要です
'use client';

// Reactライブラリから useState と useEffect という機能を読み込みます
// useState は、コンポーネント内で「状態（データ）」を管理するための機能です
// useEffect は、コンポーネントのマウント時や状態の変更時に処理を実行するための機能です
import { useState, useEffect } from 'react';

/**
 * 【Home コンポーネント】
 * この関数が、画面に表示されるコンポーネント（部品）です
 * 関数名は Home ですが、export default により、このファイルのメインコンポーネントとして扱われます
 */
export default function Home() {
  /**
   * 【useState について】
   * useState(0) は、初期値が 0 の「状態」を作成します
   * 
   * count: 現在のカウント値（数値）を保存する変数
   * setCount: count の値を変更するための関数
   * 
   * 例：setCount(5) を実行すると、count の値が 5 に変わります
   * 
   * なぜこのような仕組みがあるのか？
   * → Reactでは、状態が変わると自動的に画面が再描画されます
   * → これにより、ボタンを押すと数字が自動的に更新される仕組みが実現できます
   * 
   * 注意：初期値は0にしていますが、useEffectでlocalStorageから値を読み込むため、
   * ハイドレーションエラーを避けることができます
   */
  const [count, setCount] = useState(0);

  /**
   * 【useEffect について】
   * useEffect は、コンポーネントがマウントされた時や、特定の値が変更された時に処理を実行します
   * 
   * この useEffect は、コンポーネントがマウントされた時（初めて表示された時）に1回だけ実行されます
   * 依存配列が空 [] なので、マウント時のみ実行されます
   * 
   * 処理内容：
   * 1. localStorage から 'counter-value' というキーで保存された値を読み込む
   * 2. 値が存在する場合、その値を数値に変換して count の初期値として設定する
   * 
   * なぜマウント後に読み込むのか？
   * → Next.jsのApp Routerでは、サーバーサイドとクライアントサイドで同じ初期値を返す必要があります
   * → localStorageはブラウザ（クライアント）側でのみ利用可能なため、useEffectでマウント後に読み込むことで
   *    ハイドレーションエラー（サーバーとクライアントの初期値の不一致）を防ぎます
   */
  useEffect(() => {
    // localStorageから保存されたカウント値を読み込む
    const savedCount = localStorage.getItem('counter-value');
    if (savedCount !== null) {
      // 文字列として保存されているので、数値に変換して設定
      setCount(parseInt(savedCount, 10));
    }
  }, []); // 空の依存配列なので、マウント時のみ実行

  /**
   * 【useEffect（カウント保存用）について】
   * この useEffect は、count の値が変更されるたびに実行されます
   * 
   * 処理内容：
   * count の値を localStorage の 'counter-value' というキーに保存します
   * 
   * これにより、ブラウザをリロードしてもカウント値が保持されます
   */
  useEffect(() => {
    // カウント値が変更されるたびにlocalStorageに保存
    localStorage.setItem('counter-value', count.toString());
  }, [count]); // countが変更されるたびに実行

  /**
   * 【handleDecrement 関数】
   * 「－」ボタンがクリックされたときに実行される関数です
   * 現在の count の値から 1 を引いて、新しい値を設定します
   * ただし、カウントが0の場合はそれ以上減らない（マイナスにならない）ようにします
   */
  const handleDecrement = () => {
    setCount(Math.max(0, count - 1)); // count の値を 1 減らす（ただし0未満にはならない）
  };

  /**
   * 【handleIncrement 関数】
   * 「＋」ボタンがクリックされたときに実行される関数です
   * 現在の count の値に 1 を足して、新しい値を設定します
   */
  const handleIncrement = () => {
    setCount(count + 1); // count の値を 1 増やす
  };

  /**
   * 【handleReset 関数】
   * 「Reset」ボタンがクリックされたときに実行される関数です
   * count の値を 0 にリセットします
   */
  const handleReset = () => {
    setCount(0); // count の値を 0 に戻す
  };

  /**
   * 【return について】
   * return の後ろに書かれた内容が、実際に画面に表示されます
   * これは JSX（JavaScript XML）という形式で、HTMLに似ていますが、JavaScriptの機能も使えます
   */
  return (
    // 外側の div: 画面全体の背景とレイアウトを設定
    // className は CSS のクラス名を指定する属性です（Tailwind CSS というスタイリングツールを使用）
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* main: メインコンテンツの領域 */}
      <main className="flex flex-col items-center justify-center gap-8 p-8">
        {/* カウント表示エリア */}
        {/* {count} は、count 変数の値を画面に表示します */}
        {/* この値は、ボタンをクリックするたびに自動的に更新されます */}
        <div className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">
          {count}
        </div>

        {/* ボタン群のコンテナ */}
        <div className="flex gap-4">
          {/* －ボタン */}
          {/* onClick は、ボタンがクリックされたときに実行する関数を指定します */}
          {/* ここでは、handleDecrement 関数が実行されます */}
          <button
            onClick={handleDecrement}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-3xl font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-110 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            aria-label="カウントを減らす"
          >
            －
          </button>

          {/* ＋ボタン */}
          {/* onClick は、ボタンがクリックされたときに実行する関数を指定します */}
          {/* ここでは、handleIncrement 関数が実行されます */}
          <button
            onClick={handleIncrement}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-3xl font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-110 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            aria-label="カウントを増やす"
          >
            ＋
          </button>

          {/* Resetボタン */}
          {/* このボタンをクリックすると、handleReset 関数が実行されます */}
          <button
            onClick={handleReset}
            className="flex h-16 items-center justify-center rounded-full bg-gray-200 px-8 text-lg font-semibold text-gray-700 shadow-lg transition-all hover:bg-gray-300 hover:scale-110 active:scale-95 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="リセット"
          >
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}

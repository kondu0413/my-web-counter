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
   * 【useState（効果音ON/OFF）について】
   * 効果音を鳴らすかどうかを管理する状態です
   * デフォルトは true（ON）です
   */
  const [soundEnabled, setSoundEnabled] = useState(true);

  /**
   * 【useEffect（Audio インスタンス管理）について】
   * 効果音を再生するための Audio インスタンスを作成・管理します
   * 
   * 処理内容：
   * 1. Audio インスタンスを作成し、音声ファイルを読み込む
   * 2. コンポーネントがアンマウントされる際に、Audio インスタンスをクリーンアップする
   * 
   * メモリリークを防ぐため、useEffect のクリーンアップ関数で Audio インスタンスを適切に処理します
   */
  useEffect(() => {
    // Audio インスタンスを作成（public フォルダ直下の音声ファイルを指定）
    const clickSound = new Audio('/決定ボタンを押す7.mp3');
    
    // 音声ファイルの読み込みを開始（事前読み込み）
    clickSound.load();

    // クリーンアップ関数：コンポーネントがアンマウントされる際に実行される
    return () => {
      // 再生を停止し、リソースを解放
      clickSound.pause();
      clickSound.src = '';
    };
  }, []); // 空の依存配列なので、マウント時のみ実行

  /**
   * 【playClickSound 関数】
   * クリック音を再生する関数です
   * 
   * 処理内容：
   * 1. soundEnabled が false の場合は、音を鳴らさずに終了
   * 2. 新しい Audio インスタンスを作成（連打対策：毎回新しいインスタンスを使用）
   * 3. currentTime を 0 に設定して、最初から再生されるようにする
   * 4. 音を再生する
   * 
   * 連打対策：
   * → 毎回新しい Audio インスタンスを作成することで、前の再生を待たずに音が重なるようにします
   * → currentTime = 0 により、毎回最初から音が鳴ります
   */
  const playClickSound = () => {
    // 効果音がOFFの場合は音を鳴らさない
    if (!soundEnabled) {
      return;
    }
    
    // 新しい Audio インスタンスを作成（連打対策）
    const clickSound = new Audio('/決定ボタンを押す7.mp3');
    
    // 再生位置を最初にリセット（連打対策）
    clickSound.currentTime = 0;
    
    // 音を再生（エラーが発生してもアプリが止まらないように catch で処理）
    clickSound.play().catch((error) => {
      // 音声の自動再生がブロックされた場合など、エラーを無視
      console.log('音声再生エラー:', error);
    });
  };

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
    
    // localStorageから保存された効果音の設定を読み込む
    const savedSoundEnabled = localStorage.getItem('sound-enabled');
    if (savedSoundEnabled !== null) {
      // 文字列 'true' または 'false' を boolean に変換
      setSoundEnabled(savedSoundEnabled === 'true');
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
   * 【useEffect（効果音設定保存用）について】
   * この useEffect は、soundEnabled の値が変更されるたびに実行されます
   * 
   * 処理内容：
   * soundEnabled の値を localStorage の 'sound-enabled' というキーに保存します
   * 
   * これにより、ブラウザをリロードしても効果音のON/OFF設定が保持されます
   */
  useEffect(() => {
    // 効果音設定が変更されるたびにlocalStorageに保存
    localStorage.setItem('sound-enabled', soundEnabled.toString());
  }, [soundEnabled]); // soundEnabledが変更されるたびに実行

  /**
   * 【handleDecrement 関数】
   * 「－」ボタンがクリックされたときに実行される関数です
   * 現在の count の値から 1 を引いて、新しい値を設定します
   * ただし、カウントが0の場合はそれ以上減らない（マイナスにならない）ようにします
   */
  const handleDecrement = () => {
    playClickSound(); // クリック音を再生
    setCount(Math.max(0, count - 1)); // count の値を 1 減らす（ただし0未満にはならない）
  };

  /**
   * 【handleIncrement 関数】
   * 「＋」ボタンがクリックされたときに実行される関数です
   * 現在の count の値に 1 を足して、新しい値を設定します
   */
  const handleIncrement = () => {
    playClickSound(); // クリック音を再生
    setCount(count + 1); // count の値を 1 増やす
  };

  /**
   * 【handleReset 関数】
   * 「Reset」ボタンがクリックされたときに実行される関数です
   * count の値を 0 にリセットします
   */
  const handleReset = () => {
    playClickSound(); // クリック音を再生
    setCount(0); // count の値を 0 に戻す
  };

  /**
   * 【handleToggleSound 関数】
   * 効果音のON/OFFを切り替える関数です
   * soundEnabled の値を反転させます
   */
  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  /**
   * 【return について】
   * return の後ろに書かれた内容が、実際に画面に表示されます
   * これは JSX（JavaScript XML）という形式で、HTMLに似ていますが、JavaScriptの機能も使えます
   */
  return (
    // 外側の div: 画面全体の背景とレイアウトを設定
    // className は CSS のクラス名を指定する属性です（Tailwind CSS というスタイリングツールを使用）
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* 効果音ON/OFFトグルボタン（右上に配置） */}
      <button
        onClick={handleToggleSound}
        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white hover:scale-110 active:scale-95 dark:bg-gray-700/80 dark:hover:bg-gray-700"
        aria-label={soundEnabled ? '効果音をOFFにする' : '効果音をONにする'}
      >
        {soundEnabled ? (
          // スピーカーONアイコン
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
          >
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06c3.401-3.402 3.401-8.926 0-12.328a.75.75 0 0 1 0-1.06Z" />
            <path d="M15.932 7.884a.75.75 0 0 1 1.06 0 6.003 6.003 0 0 1 0 8.488.75.75 0 1 1-1.06-1.06 4.503 4.503 0 0 0 0-6.368.75.75 0 0 1 0-1.06Z" />
          </svg>
        ) : (
          // スピーカーOFFアイコン（斜線付き）
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-gray-500 dark:text-gray-400"
          >
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06Z" />
            <path
              fillRule="evenodd"
              d="M17.78 9.22a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06l5.5-5.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
            <path d="M15.932 7.884a.75.75 0 0 1 1.06 0 6.003 6.003 0 0 1 0 8.488.75.75 0 1 1-1.06-1.06 4.503 4.503 0 0 0 0-6.368.75.75 0 0 1 0-1.06Z" />
          </svg>
        )}
      </button>

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

'use client';

import { useState } from 'react';

export default function Home() {
  // Android Composeの `remember { mutableStateOf(0) }` に相当する部分
  // Reactでは `useState` が状態を保持し、再レンダリング時に値を維持します
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center gap-8 p-8">
        {/* カウント表示 */}
        <div className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">
          {count}
        </div>

        {/* ボタン群 */}
        <div className="flex gap-4">
          {/* ＋ボタン */}
          <button
            onClick={handleIncrement}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-3xl font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-110 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            aria-label="カウントを増やす"
          >
            ＋
          </button>

          {/* Resetボタン */}
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

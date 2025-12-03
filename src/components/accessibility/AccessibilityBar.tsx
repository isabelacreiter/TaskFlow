'use client';

export default function AccessibilityBar() {
  const increaseFontSize = () => {
    const root = document.documentElement;
    const current = getComputedStyle(root).getPropertyValue("--font-size") || "16px";
    const size = parseInt(current);
    root.style.setProperty("--font-size", (size + 2) + "px");
  };

  const decreaseFontSize = () => {
    const root = document.documentElement;
    const current = getComputedStyle(root).getPropertyValue("--font-size") || "16px";
    const size = parseInt(current);
    if (size > 12) root.style.setProperty("--font-size", (size - 2) + "px");
  };

  const toggleHighContrast = () => {
    document.body.classList.toggle("high-contrast");
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-40 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg p-3"
      role="region"
      aria-label="Controles de acessibilidade"
    >
      <div className="flex flex-col gap-2">
        {/* Aumentar Fonte */}
        <button
          onClick={increaseFontSize}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium transition"
          aria-label="Aumentar tamanho da fonte"
          title="A+ Aumentar Fonte"
        >
          A+
        </button>

        {/* Diminuir Fonte */}
        <button
          onClick={decreaseFontSize}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium transition"
          aria-label="Diminuir tamanho da fonte"
          title="A- Diminuir Fonte"
        >
          A-
        </button>

        {/* Contraste Alto */}
        <button
          onClick={toggleHighContrast}
          className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 font-medium transition"
          aria-label="Alternar contraste alto"
          title="Contraste Alto"
        >
          ◐
        </button>

        {/* Modo Escuro */}
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 font-medium transition"
          aria-label="Alternar modo escuro"
          title="Modo Escuro/Claro"
        >
          🌙
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { RTAForm } from './components/RTAForm';
import { FloatingThemeToggle } from './components/FloatingThemeToggle';
import { useTheme } from './hooks/useTheme';
import { TrelloForm } from './components/TrelloForm';
import { Sidebar } from './components/Sidebar';

function App() {
  // Inicializar o tema na aplicação
  useTheme();

  const [screen, setScreen] = useState<'rta' | 'trello'>('rta');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar fixa com tema moderno e colapsável */}
      <aside
        className={`hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300 bg-gradient-to-b from-indigo-700 to-violet-700 text-white shadow-xl ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <Sidebar
          current={screen}
          onChange={setScreen}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 min-w-0">
        {/* Topbar somente para mobile com toggle */}
        <div className="md:hidden sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-indigo-700 border border-indigo-200 bg-indigo-50"
            >
              ☰
            </button>
            <span className="font-semibold text-gray-800">Insurance System</span>
            <span />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {screen === 'rta' ? <RTAForm /> : <TrelloForm />}
        </div>
      </main>

      <FloatingThemeToggle />
    </div>
  );
}

export default App;

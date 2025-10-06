import { RTAForm } from './components/RTAForm';
import { FloatingThemeToggle } from './components/FloatingThemeToggle';
import { useTheme } from './hooks/useTheme';

function App() {
  // Inicializar o tema na aplicação
  useTheme();

  return (
    <>
      <RTAForm />
      <FloatingThemeToggle />
    </>
  );
}

export default App

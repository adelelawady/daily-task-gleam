import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import TasksPage from './pages/Tasks';
import Statistics from './pages/Statistics';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Daily Tasks Tracker</h1>
            <Navigation />
          </header>

          <main>
            <Routes>
              <Route path="/" element={<TasksPage />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
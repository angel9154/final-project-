import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DrinkMatcher } from './components/DrinkMatcher';
import { MatchedDrinksPage } from './components/MatchedDrinksPage';
import { LiquorSelector } from './components/LiquorSelector';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <h1>Pour Decisions</h1>
        <Routes>
          <Route path="/" element={<LiquorSelector />} />
          <Route path="/drink-matcher" element={<DrinkMatcher />} />
          <Route path="/matched-drinks" element={<MatchedDrinksPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

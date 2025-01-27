import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DrinkMatcher } from './DrinkMatcher/DrinkMatcher';
import { MatchedDrinksPage } from './components/MatchedDrinksPage';
import { LiquorSelector } from './components/LiquorSelector';
import './App.css';
// At the top of your main file
import 'bootstrap/dist/css/bootstrap.min.css';

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

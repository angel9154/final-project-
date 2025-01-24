

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// In LiquorSelector.tsx
export const LiquorSelector = () => {
  const [selectedLiquor, setSelectedLiquor] = useState("");
  const [prefersSweet, setPrefersSweet] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedLiquor && prefersSweet !== null) {
      navigate("/drink-matcher", { 
        state: { 
          selectedLiquor,
          prefersSweet 
        } 
      });
    }
  };

  return (
    <div>
      <h2>Build Your Drink Profile</h2>
      
      {/* Liquor Selection */}
      <div className="form-group">
        <label>Choose Your Base Liquor:</label>
        <select
          value={selectedLiquor}
          onChange={(e) => setSelectedLiquor(e.target.value)}
        >
          <option value="">Select a liquor</option>
          <option value="Rum">Rum</option>
          <option value="Gin">Gin</option>
          <option value="Tequila">Tequila</option>
          <option value="Whiskey">Whiskey</option>
          <option value="Vodka">Vodka</option>
        </select>
      </div>

      {/* Sweet Preference */}
      <div className="form-group">
        <label>Do you like sweet drinks?</label>
        <select
          value={String(prefersSweet)}
          onChange={(e) => setPrefersSweet(e.target.value === 'true')}
        >
          <option value="null">Choose...</option>
          <option value="true">Yes, sweet please! 🍭</option>
          <option value="false">No, keep it dry 🍸</option>
        </select>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={!selectedLiquor || prefersSweet === null}
      >
        Start Mixing!
      </button>
    </div>
  );
};
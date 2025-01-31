

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// In LiquorSelector.tsx
export const LiquorSelector = () => {
  const [selectedLiquor, setSelectedLiquor] = useState("");
  const [prefersSweet, setPrefersSweet] = useState<boolean | null>(null); // remember this prefersSweet might not have a value 
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedLiquor && prefersSweet !== null) {
      navigate("/drink-matcher", { 
        state: { // this is passing data to the next page
          selectedLiquor,
          prefersSweet 
        } 
      });
    }
  };

  return (
    <div className="container mt-5"> {/* 1. Add Bootstrap container & margin-top */}
      <h2 className="text-center mb-4">Ready to Get Drunk?</h2>
      
      {/* Liquor Selection */}
      <div className="mb-3">
        <label>What type are person you are interested in:</label>
        <select
        className={`form-select ${!selectedLiquor ? 'is-invalid' : 'is-valid'}`} // this is adding bootstrap classes if 
        // if the user has not selected a liquor or if the liquor is invalid it will throw a warning 
          value={selectedLiquor}
          onChange={(e) => setSelectedLiquor(e.target.value)}
        >
          <option value="">Select your type</option>
          <option value="Rum">"I am a Caribbean person that loves beaches."</option>
          <option value="Gin">"I'm a refined rebel crafting botanical elegance."</option>
          <option value="Tequila">"I'm a fiery soul chasing sun-baked adventures."</option>
          <option value="Whiskey">"I'm a rugged romantic aged in oak-kissed wisdom."</option>
          <option value="Vodka">"I'm a chilled minimalist savoring icy clarity."</option>
        </select>
        {!selectedLiquor && (
        <div className="invalid-feedback">Choose your main type</div>
      )}
      </div>

      {/* Sweet Preference */}
      <div className="mb-4">
      <label className="form-label">What type of person are you interested in?</label>
        <select
         className={`form-select ${prefersSweet === null ? 'is-invalid' : 'is-valid'}`}
          value={String(prefersSweet)} // converts boolean value into string 
          onChange={(e) => setPrefersSweet(e.target.value === 'true')} // if the value is true it will set the state to true
        >
          <option value="null">Choose...</option>
          <option value="true">I am interested in sweetness! 🍭</option>
          <option value="false">I am interested in dryness 🍸</option>
        </select>
        {prefersSweet === null && (
        <div className="invalid-feedback">Please select a sweetness preference</div>
      )}
      </div>

      <button 
         className="btn btn-primary w-100"
        onClick={handleSubmit} 
        disabled={!selectedLiquor || prefersSweet === null}
      >
        Start Mixing!
      </button>
    </div>
  );
};
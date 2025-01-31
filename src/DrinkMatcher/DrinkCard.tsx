import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Drink } from '../types/types';

interface DrinkCardProps {
  drink: Drink;
  // the purpouse of using the typescript type void is to specify that the function will not return anything
  onSkip: () => void; // callback function to be called when the user skips the drink.
  onMatch: () => void; // callback function to be called when the user matches the drink.
  disabled: boolean; // this lets the parent component know if the heart button should be disabled
}

export const DrinkCard: React.FC<DrinkCardProps> = ({  // this is a  reactfunctional component that is taking in the 
    // drink, onSkip, onMatch, and disabled props created before 
  drink, 
  onSkip, 
  onMatch, 
  disabled 
}) => (
  <div className="swipe-card card">
    <div className="image-container">
      <img src={drink.strPicture} className="card-img" alt={drink.strDrink} />
    </div>
    
    <div className="card-body">
      <h2 className="card-title mb-3">{drink.strDrink}</h2>
      
      <div className="mb-4 ingredients-container">
        <h5>Interested in:</h5>
        <div className="d-flex flex-wrap gap-2">
          {Array.from({ length: 15 }, (_, i) => {
            const ingredient = drink[`strIngredient${i + 1}`];
            return ingredient ? (
              <span key={i} className="badge bg-primary rounded-pill">
                {ingredient}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>

    <div className="action-buttons">
      <button className="skip-btn" onClick={onSkip}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <button className="heart-btn" onClick={onMatch} disabled={disabled}>
        <FontAwesomeIcon icon={faHeart} />
      </button>
    </div>
  </div>
);

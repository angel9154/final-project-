import { useLocation, Link } from 'react-router-dom';
import { Drink } from '../types/types';

export const MatchedDrinksPage = () => {
  const location = useLocation();
  const { matchedDrinks = [], suggestedDrinks = [] } = location.state || {};
 
  if (matchedDrinks.length === 0 && suggestedDrinks.length === 0) {
    return <div>No matches found! <Link to="/">Go back</Link></div>;
  }
  
  return (
    
    <div style={{ padding: '1rem' }}>
    <h1>Your Matched Drinks</h1>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {matchedDrinks.map((drink: Drink) => (
        <div 
          key={drink.idDrink}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem'
          }}
        >
          <h3>{drink.strDrink}</h3>
          {drink.strPicture && (
            <img
              src={drink.strPicture}
              alt={drink.strDrink}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          )}
          {/* Add Ingredients Here */}
          <div style={{ marginTop: '1rem' }}>
            <h4>I am this type of person…:</h4>
            {Array.from({ length: 15 }).map((_, i) => {
              const ingredient = drink[`strIngredient${i + 1}`];
              if (!ingredient) return null;
              const measure = drink[`strMeasure${i + 1}`] || '';
              return (
                <div key={i} style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  • {ingredient} {measure && `- ${measure}`}
                </div>
              );
            })}
          </div>
                  {/* Add Instructions Here */}
{drink.strInstructions && (
  <div style={{ marginTop: '1rem' }}>
    <h4>This is how I like to be handled baby :</h4>
    <p style={{ 
      fontSize: '0.9rem',
      lineHeight: '1.4',
      marginTop: '0.5rem',
      whiteSpace: 'pre-line'  // Preserves line breaks from the API
    }}>
      {drink.strInstructions}
    </p>
    </div>
)}
        </div>
      ))}
    </div>
    {suggestedDrinks.length > 0 && (
  <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
    <h2>Your Potential Matches</h2>
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    }}>
      {suggestedDrinks.map((drink: Drink) => (
        <div
          key={drink.idDrink}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem'
          }}
        >
          <h4>{drink.strDrink}</h4>
          {drink.strPicture && (
            <img
              src={drink.strPicture}
              alt={drink.strDrink}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          )}
          {/* Add Ingredients Here */}
          <div style={{ marginTop: '1rem' }}>
            <h4>I am this type of person…:</h4>
            {Array.from({ length: 15 }).map((_, i) => {
              const ingredient = drink[`strIngredient${i + 1}`];
              if (!ingredient) return null;
              const measure = drink[`strMeasure${i + 1}`] || '';
              return ( // represent the ingredient and mesurments of the drink 
                <div key={i} style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}> 
                  • {ingredient} {measure && `- ${measure}`} 
                </div>
              );
              
            })}
          </div>
          {/* Add Instructions Here */}
{drink.strInstructions && (
  <div style={{ marginTop: '1rem' }}>
    <h4>This is how I like to be handled baby :</h4>
    <p style={{ 
      fontSize: '0.9rem',
      lineHeight: '1.4',
      marginTop: '0.5rem',
      whiteSpace: 'pre-line'  // Preserves line breaks from the API
    }}>
      {drink.strInstructions}
    </p>
    </div>
)}
        </div>
      ))}
    </div>
  </div>
)}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/drink-matcher">← Back interest selector</Link>
      </div>
    </div>
  );
};
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
          </div>
        ))}
      </div>

      {suggestedDrinks.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
          <h2>You Might Also Like</h2>
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
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/">← Back to Matching</Link>
      </div>
    </div>
  );
};
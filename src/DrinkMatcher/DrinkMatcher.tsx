import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ApiDrink, Drink } from '../types/types';
import { useDrinkFetcher } from '../API/useDrinkFetcher';
import { matchDrink } from '../utils/drinkMatcher';
import { DrinkCard } from './DrinkCard';

export const DrinkMatcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // did not had to use useMemo here it is overkill but i am going to leave it for future reference 
  // useMemo is a way for the program to save cache so it does not have to rewrite the information when location.state changes
 // location.state is an object in react router that contains data from the previous page and transfer its to another page 
  // Drink is a type annotation that make sure that every drink object is a string
  // number is an annotation that make sure that the currentDrinkIndex is a number
 const { selectedLiquor, prefersSweet } = useMemo(() => location.state || {}, [location.state]);
  const [currentDrinkIndex, setCurrentDrinkIndex] = useState<number>(0);
  const [matchedDrinks, setMatchedDrinks] = useState<Drink[]>([]);
  const [suggestedDrinks, setSuggestedDrinks] = useState<Drink[]>([]);
  
  const { fetchedDrinks, loading, fetchDrinks } = useDrinkFetcher();

  useEffect(() => {
    if (!selectedLiquor) {
      navigate('/');
    }
  }, [selectedLiquor, navigate]); // this will make the component re run 

  useEffect(() => {
    fetchDrinks();
  }, []);

  useEffect(() => {
    if (
      currentDrinkIndex >= fetchedDrinks.length - 10 &&
      fetchedDrinks.length > 0 &&
      !loading
    ) {
      fetchDrinks();
    }
  }, [currentDrinkIndex, fetchedDrinks.length, loading]); // this means the effect will re run when ever the balues of these property changes

  const currentDrink = fetchedDrinks[currentDrinkIndex];

  const handleMatch = () => {
    if (!currentDrink) return;

    const { isMatch, isSuggested } = matchDrink(currentDrink, selectedLiquor, prefersSweet);

//This code checks if the current drink is a match and not already in the list of matched drinks. 
// If both conditions are true, it adds the current drink to the list of matched drinks.
    if (isMatch) { // this checks if the current drink is a match

      // .some() is a method that returns true if at least one element in the array passes the test implemented by the provided function

      const isDuplicate = matchedDrinks.some(drink => drink.idDrink === currentDrink.idDrink); 
      if (!isDuplicate) {
        setMatchedDrinks(prev => [...prev, currentDrink]); // this add the current drink to the list of matched drinks while keeping the previous drinks as well 
      }
    }

    if (isSuggested) {
      const isSuggestedDuplicate = suggestedDrinks.some(
        drink => drink.idDrink === currentDrink.idDrink
      );
      if (!isSuggestedDuplicate) {
        setSuggestedDrinks(prev => [...prev, currentDrink]);
      }
    }

    moveToNextDrink();
  };

  const moveToNextDrink = () => {
    if (currentDrinkIndex < fetchedDrinks.length - 1) { // we need minus 1 because the index starts from 0
      setCurrentDrinkIndex(prev => prev + 1); // this is saying remember the last drink and move up to 1 
    }
  };

  return (
    <div className="container-fluid" style={{ minHeight: '100vh' }}>
      <div className="text-center py-3 bg-light"> 
        {/* Py stand for padding y -axis */}
        <h2 className="mb-1">Current Interests</h2>
        {/* mb stand for margin bottom and text-muted stands for a less important grayish color */}
        <p className="mb-0 text-muted">
          {selectedLiquor} • {prefersSweet ? "Sweet 🍭" : "Dry 🥃"}
        </p>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            {/* role status is used to to provide a semantic meaning to an element */}
            <span className="visually-hidden">Searching for more drinks...</span>
          </div>
        </div>
      ) : currentDrink ? (
        // here we are passing the props to the DrinkCard component
        <DrinkCard
          drink={currentDrink}
          onSkip={moveToNextDrink}
          onMatch={handleMatch}
          disabled={!selectedLiquor}
        />
        // the purpouse of null is to make sure that the component will not render if the currentDrink is null
      ) : null} 
{/* passes the state to the next page  */}
      <Link to="/matched-drinks" state={{ matchedDrinks, suggestedDrinks }}> 
        View Matched Drinks
      </Link>

      <div className="fixed-bottom text-end small text-muted pe-3">
        Potential Matches: {suggestedDrinks.length} • 
        Matched: {matchedDrinks.length}
      </div>
    </div>
  );
};










// const handleMatch = () => {
//     if (selectedLiquor) {
//       const normalizedSelectedLiquor = selectedLiquor.toLowerCase();

//       // Get all the variations of the selected liquor
//       const validIngredients = ingredientMappings[normalizedSelectedLiquor] || [normalizedSelectedLiquor];

  //          // Check all `strIngredient` fields (from 1 to 10)
                        // const matches = validIngredients.some((ingredient: string) => {
                        //     for (let i = 1; i <= 10; i++) {
                        //       const currentIngredient = currentDrink[`strIngredient${i}`]?.toLowerCase();
                        //       if (currentIngredient && currentIngredient.includes(ingredient)) {
                        //         return true;
                        //       }
                        //     }
                        //     return false;
                        //   });

        //   // Check if the current drink ingredient matches any of the variations
        //   const matches = validIngredients.some(ingredient =>
        //     currentDrink.strIngredient1?.toLowerCase().includes(ingredient)
        //   );

 //       if (matches) {
                                                //         setMatchedDrinks([...matchedDrinks, currentDrink]);
                                                //       }
                                                //     }
                                                //     moveToNextDrink();
                                                //   };
    // const handleMatch = () => {
    //     if (currentDrink.strIngredient1?.toLowerCase() === selectedLiquor.toLowerCase()) {
    //       setMatchedDrinks([...matchedDrinks, currentDrink]);
    //     }
    //     moveToNextDrink();
    //   };
    
    //   const handleSkip = () => moveToNextDrink();
    // create logic to move to the next drink if true move to next drink if false already passed all drinks 
    //   const moveToNextDrink = () => { 
    //     if (currentDrinkIndex < drinksData.drinks.length - 1) {
    //       setCurrentDrinkIndex(prev => prev + 1);
    //     } else {
    //       alert("All drinks processed!");
    //     }
    //   };
//       return (
//         <div>
//           <select 
//             value={selectedLiquor} 
//             onChange={(e) => setSelectedLiquor(e.target.value)}
//           >
//             <option value="">Select a liquor</option>
//             <option value="Rum">Rum</option>
//             <option value="Gin">Gin</option>
//             <option value="Tequila">Tequila</option>
//             <option value="Whiskey">Whiskey</option>
//             <option value="Vodka">Vodka</option>
//           </select>
    
//           {currentDrink && (
//             <div>
//               <h2>{currentDrink.strDrink}</h2>
//               <p>{currentDrink.strInstructions}</p>
//               <h3>Ingredients:</h3>
//               <ul>
//                 {Object.keys(currentDrink)
//                   .filter(key => key.startsWith('strIngredient'))
//                   .map((key) => (
//                     <li key={key}>
//                       {currentDrink[key]} – {currentDrink[`strMeasure${key.slice(13)}`]}
//                     </li>
//                   ))}
//               </ul>
//               <button onClick={handleMatch} disabled={!selectedLiquor}>Match</button>
//               <button onClick={handleSkip}>Skip</button>
//             </div>
//           )}
    
//           {matchedDrinks.length > 0 && (
//             <div>
//               <h3>Matched Drinks:</h3>
//               <ul>
//                 {matchedDrinks.map((drink) => (
//                   <li key={drink.idDrink}>{drink.strDrink}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       );
//   };
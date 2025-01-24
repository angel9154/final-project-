import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Drink, ApiDrink } from "../types/types";
// import { MatchedDrinks } from "./MatchedDrinks";
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
// import { drinksData } from "../data/drinkdata"


export const DrinkMatcher = () => {
  
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedLiquor, prefersSweet } = useMemo(() => location.state || {}, [location.state]);
    const [currentDrinkIndex, setCurrentDrinkIndex] = useState<number>(0);
    const [matchedDrinks, setMatchedDrinks] = useState<Drink[]>([]);
    const [fetchedDrinks, setFetchedDrinks] = useState<Drink[]>([]);
    const [suggestedDrinks, setSuggestedDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
   
      // Redirect if no liquor selected
  useEffect(() => {
    if (!selectedLiquor) {
      navigate('/');
    }
  }, [selectedLiquor, navigate]);
      
       const fetchDrinks = async () => {
    setLoading(true);
    try {
        const responses = await Promise.all( // array.from creates an array with 10 empty slots that will get sub by axios.get
            Array.from({ length: 10 }).map(() => 
              axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
            )
          );

      // Transform API data to match Drink type
      const newDrinks: Drink[] = responses.map(res => {
        const apiDrink: ApiDrink = res.data.drinks[0];
        return {
          idDrink: apiDrink.idDrink,
          strDrink: apiDrink.strDrink,
          strInstructions: apiDrink.strInstructions,
          strPicture: apiDrink.strDrinkThumb,
          // Map ingredients 1-15, adjust based on your needs
          ...Object.fromEntries(
            Array.from({ length: 15 }, (_, i) => i + 1).map(i => [
              `strIngredient${i}`,
              apiDrink[`strIngredient${i}`]
            ])
          )
        } as Drink;
      });

      setFetchedDrinks(prev => [...prev, ...newDrinks]);
    } catch (error) {
      console.error("Error fetching drinks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchDrinks();
  }, []);

  // Fetch more drinks when nearing the end of the list
  useEffect(() => {
    if (
      currentDrinkIndex >= fetchedDrinks.length - 10 &&
      fetchedDrinks.length > 0 &&
      !loading
    ) {
      fetchDrinks();
    }
  }, [currentDrinkIndex, fetchedDrinks.length, loading]);

  const currentDrink = fetchedDrinks[currentDrinkIndex];
// const currentDrink = drinksData.drinks[currentDrinkIndex];
     

    // Ingredient mapping for flexible matching
  const ingredientMappings: Record<string, string[]> = {
    rum: ["light rum", "dark rum", "coconut rum", "spiced rum", "151 proof rum", "Añejo rum", "Cachaca", "rum", "spiced rum"],
    gin: ["gin"],
    tequila: ["tequila", "mezcal"],
    whiskey: ["whiskey", "bourbon", "rye whiskey", "crown royal", "scotch", "jack daniels", "jim beam", "blended scotch", "blended whiskey", "blended bourbon"],
    vodka: ["vodka", "absolut vodka", "absolut" ], // Added vodka mapping
    sugar: ['condensed milk', 'coconut syrup', 'chocolate syrup', 'honey',
    'kahlua', 'midori melon liqueur', 'baileys irish cream',
    'sugar syrup', 'schnapps', 'cherry brandy', 'amaretto',
    'grenadine', 'goldschlager', 'vanilla ice-cream', 'coca-cola',
    'creme de banane', 'blue curacao', 'peach vodka', 'vanilla syrup',
    'white creme de menthe', 'sweet and sour', 'kiwi', 'sprite',
    'pink lemonade', 'cranberry juice', 'liqueur', 'juice',
    'lemon juice', 'orange juice', 'syrup', 'schnapps', '7up', 'creme', 'cream', 'nectar'] // Added vodka mapping
  };

  
  const handleMatch = () => {
    if (!currentDrink) return;
// this war throwing cannot read property of to lower case so added  Optional Chaining (?.)
    const normalizedLiquor = selectedLiquor?.toLowerCase() || '';
    const validLiquors = ingredientMappings[normalizedLiquor] || [normalizedLiquor];
     const sweetIngredients = ingredientMappings.sugar || [];

    let hasSweetMatch = true;
    if (prefersSweet !== null) {
      if (prefersSweet) {
        // Check FOR sweet ingredients
        hasSweetMatch = sweetIngredients.some(sweetener => {
          for (let i = 1; i <= 15; i++) {
            const drinkIngredient = currentDrink[`strIngredient${i}`]?.toLowerCase();
            if (drinkIngredient?.includes(sweetener.toLowerCase())) return true;
          }
          return false;
        });
      } else {
        // Check AGAINST sweet ingredients
        hasSweetMatch = !sweetIngredients.some(sweetener => {
          for (let i = 1; i <= 15; i++) {
            const drinkIngredient = currentDrink[`strIngredient${i}`]?.toLowerCase();
            if (drinkIngredient?.includes(sweetener.toLowerCase())) return true;
          }
          return false;
        });
      }
    }

          const hasLiquorMatch = validLiquors.some((ingredient: string) => {
        for (let i = 1; i <= 15; i++) {
            const drinkIngredient = currentDrink[`strIngredient${i}`]?.toLowerCase();
            if (drinkIngredient?.includes(ingredient.toLowerCase())) return true;

        }
        return false;
    });      
         // Final match decision

         const isMatch = hasLiquorMatch && hasSweetMatch;
              
         const isSuggested = prefersSweet && !hasLiquorMatch && hasSweetMatch;

    if (isMatch) {
        // Check if the drink is not already in matched drinks to avoid duplicates
        const isDuplicate = matchedDrinks.some(drink => drink.idDrink === currentDrink.idDrink);
        if (!isDuplicate) {
            setMatchedDrinks(prev => [...prev, currentDrink]);
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
    moveToNextDrink()
};
                                                  

    const moveToNextDrink = () => {
        if (currentDrinkIndex < fetchedDrinks.length - 1) {
          setCurrentDrinkIndex(prev => prev + 1);
        } else {
          // Handled by useEffect to fetch more drinks
        }
      };
    

      return (
        
        <div>
          <div className="preference-display">
            <h2>Current Preferences:</h2>
            <p>Base Spirit: {selectedLiquor}</p>
            <p>Sweet Preference: {prefersSweet ? "Yes 🍭" : "No 🥃"}</p>
          </div>
      
          {loading ? (
            <div>Loading drinks...</div>
          ) : (
            currentDrink && (
              <div>
                <h2>{currentDrink.strDrink}</h2>
                {currentDrink.strPicture && (
                  <img 
                    src={currentDrink.strPicture} 
                    alt={currentDrink.strDrink}
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                )}
                <p>{currentDrink.strInstructions}</p>
                <h3>Ingredients:</h3>
                <ul>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map(i => {
                    const ingredient = currentDrink[`strIngredient${i}`];
                    return ingredient ? (
                      <li key={i}>
                        {ingredient} – {currentDrink[`strMeasure${i}`]}
                      </li>
                    ) : null;
                  })}
                </ul>
                <button 
                  onClick={handleMatch} 
                  disabled={!selectedLiquor || !currentDrink}
                >
                  Match
                </button>
                <button onClick={moveToNextDrink}>Skip</button>
              </div>
            )
          )}
       <div style={{ color: 'red', padding: '1rem' }}>
      Debug Info:<br />
      Suggested Drinks Count: {suggestedDrinks.length}<br />
      Last Suggested Drink: {suggestedDrinks[suggestedDrinks.length - 1]?.strDrink}
    </div>
          <Link to="/matched-drinks" state={{ matchedDrinks, suggestedDrinks }}>
            View Matched Drinks ({matchedDrinks.length})
          </Link>
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
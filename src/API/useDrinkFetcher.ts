import { useState } from 'react';
import axios from 'axios';
import { Drink, ApiDrink } from '../types/types';

export const useDrinkFetcher = () => {
  const [fetchedDrinks, setFetchedDrinks] = useState<Drink[]>([]); // <Drink[]> is used to specify the type
  //  of the array and it is going to be an empty array 
  const [loading, setLoading] = useState<boolean>(true); 

  const fetchDrinks = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all( // this converts a bunch of promises into a single promise
        Array.from({ length: 10 }).map(() => 
          axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        )
      );

      const newDrinks: Drink[] = responses.map(res => { // .map converts the json data into an array 
        const apiDrink: ApiDrink = res.data.drinks[0]; // only need to access the firt element 
        return {
          idDrink: apiDrink.idDrink,
          strDrink: apiDrink.strDrink,
          strInstructions: apiDrink.strInstructions,
          strPicture: apiDrink.strDrinkThumb,
          ...Object.fromEntries( // this what it does it organizes the data coming
          //  from the api and pairs the key with the value
            Array.from({ length: 15 }, (_, i) => { // this creates an array with 15 empty slots 
              // that are later populated with the data coming from the api 
              const index = i + 1;
              return [
                [`strIngredient${index}`, apiDrink[`strIngredient${index}`]],
                [`strMeasure${index}`, apiDrink[`strMeasure${index}`]]
              ];
            }).flat() // this is used to combined nested arrays into a single array
          )
        } as Drink; // make sure the object that we are returning is of type Drink
      });

      setFetchedDrinks(prev => [...prev, ...newDrinks]); // this is used to add the new drinks to the list of fetched drinks
    } catch (error) {
      console.error("Error fetching drinks:", error);
    } finally { // this is used to set the loading state to false when the data is fetched
      setLoading(false);
    }
  };

  return { fetchedDrinks, loading, fetchDrinks }; // return these properties to be able to dislay the list of drinks
  // to know if the data is being fetched and to fetch drinks on demand 
};
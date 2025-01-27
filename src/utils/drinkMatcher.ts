import { Drink } from '../types/types';
import { ingredientMappings } from '../constants/ingredientMappings';

export const matchDrink = (
  drink: Drink,
  selectedLiquor: string,
  prefersSweet: boolean
): { isMatch: boolean; isSuggested: boolean } => {
// we are prepating data for the match drinks function to determine if the drink is a match
// selectedLiquor is a string that represents the liquor type that the user selected
// ? is a chaning that helps prevent errors if selectedLiquor is undefined
// the reason for having a or empty string is to make sure that the program does not crash if selectedLiquor is undefined
  const normalizedLiquor = selectedLiquor?.toLowerCase() || '';
  const validLiquors = ingredientMappings[normalizedLiquor] || [normalizedLiquor];
  const sweetIngredients = ingredientMappings.sugar || [];

// .some() is a javascript method that checks if at least one of the 
//elemements sastifies the given condition and then stops the loop 

  const hasLiquorMatch = validLiquors.some((ingredient: string) => {
    for (let i = 1; i <= 15; i++) {
      const drinkIngredient = drink[`strIngredient${i}`]?.toLowerCase();
      if (drinkIngredient?.includes(ingredient.toLowerCase())) return true;
    }
    return false;
  });
// this block of code make sure that the user choose if they like sweet or not
// if they like sweet it will check if the drink has any sweet ingredients
// and match that drink with the base liquour 
// as if the user choose they like sweet it will activate the suggestion feature
// and check what drinks are sweet to even though there is no base liquour
// if user does not want sweet it will check if the drink does not have any sweet ingredients

  const hasSweetMatch = prefersSweet !== null ? prefersSweet ?
  // fisrt loop is used if prefersSweet is true
    sweetIngredients.some(sweetener => {
      for (let i = 1; i <= 15; i++) {
        const drinkIngredient = drink[`strIngredient${i}`]?.toLowerCase();
        if (drinkIngredient?.includes(sweetener.toLowerCase())) return true;
      }
      return false;
    }) :
    // second loop is used if prefersSweet is false
    !sweetIngredients.some(sweetener => {
      for (let i = 1; i <= 15; i++) {
        const drinkIngredient = drink[`strIngredient${i}`]?.toLowerCase();
        if (drinkIngredient?.includes(sweetener.toLowerCase())) return true;
      }
      return false;
    }): false;

  return {
    isMatch: hasLiquorMatch && hasSweetMatch,
    isSuggested: prefersSweet && !hasLiquorMatch && hasSweetMatch
  };
};
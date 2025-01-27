// define the drink interface 
export interface Drink {
    idDrink: string;
    strDrink: string;
    strInstructions: string;
    strPicture: string;
    [key: string]: string; // Allow dynamic ingredient/measure keys
}
export interface ApiDrink {
    idDrink: string;
    strDrink: string;
    strInstructions: string;
    strIngredient1?: string;
    strIngredient2?: string;
    strIngredient3?: string;
    strIngredient4?: string;
    strIngredient5?: string;
    strIngredient6?: string;
    strIngredient7?: string;
    strIngredient8?: string;
    strIngredient9?: string;
    strIngredient10?: string;
    strMeasure1?: string;
    strMeasure2?: string;
    strMeasure3?: string;
    strMeasure4?: string;
    strMeasure5?: string;
    strMeasure6?: string;
    strMeasure7?: string;
    strMeasure8?: string;
    strMeasure9?: string;
    strMeasure10?: string;
    strMeasure11?: string;
    strMeasure12?: string;
    strMeasure13?: string;
    strMeasure14?: string;
    strMeasure15?: string;
    // ... include other possible ingredients up to strIngredient15
    [key: string]: any; // Allow any other properties
  }
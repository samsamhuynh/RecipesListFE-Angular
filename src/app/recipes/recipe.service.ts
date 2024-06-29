import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      "Tasty Schnitzel",
      "this is simply",
      "https://images.immediate.co.uk/production/volatile/sites/30/2023/09/Prawn-harissa-spaghetti--b3b0fdd.jpg?quality=90&webp=true&resize=600,545",
      [new Ingredient("Meat", 1), new Ingredient("French Fries", 20)]
    ),
    new Recipe(
      "Big Fat Burger",
      "this is simply",
      "https://images.immediate.co.uk/production/volatile/sites/30/2023/09/Prawn-harissa-spaghetti--b3b0fdd.jpg?quality=90&webp=true&resize=600,545",
      [new Ingredient("Buns", 2), new Ingredient("Meat", 1)]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}

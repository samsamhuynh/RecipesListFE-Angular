import { Component, OnInit } from "@angular/core";
import { Recipes } from "../recipes.model";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipes[] = [
    new Recipes(
      "A Test Recipe",
      " this is simply",
      "https://images.immediate.co.uk/production/volatile/sites/30/2023/09/Prawn-harissa-spaghetti--b3b0fdd.jpg?quality=90&webp=true&resize=600,545"
    ),
    new Recipes(
      "A Test Recipe",
      " this is simply",
      "https://images.immediate.co.uk/production/volatile/sites/30/2023/09/Prawn-harissa-spaghetti--b3b0fdd.jpg?quality=90&webp=true&resize=600,545"
    ),
  ];

  constructor() {}

  ngOnInit() {}
}

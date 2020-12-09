import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  url = 'https://recipe-database-71a69-default-rtdb.firebaseio.com/recipes.json';

  constructor(private http: HttpClient, private recipesService: RecipeService) {

  }

  storeRecipes(): void {
    const recipes = this.recipesService.getRecipes();
    this.http.put(
      this.url,
      recipes).subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() : Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.url)
    .pipe(map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }),
    tap(recipes => {
      this.recipesService.setRecipes(recipes);
    }));
  }
}

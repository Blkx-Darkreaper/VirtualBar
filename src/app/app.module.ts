import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RecipeSelectionComponent } from './recipe-selection/recipe-selection.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeListService } from './recipe-list.service';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeIngredientsService } from './recipe-ingredients.service';
import { RecipeDirectionsService } from './recipe-directions.service';
import { RecipeInfoComponent } from './recipe-info/recipe-info.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipeSelectionComponent,
    RecipeListComponent,
    RecipeComponent,
    RecipeInfoComponent,
    CheckboxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    RecipeListService,
    RecipeIngredientsService,
    RecipeDirectionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

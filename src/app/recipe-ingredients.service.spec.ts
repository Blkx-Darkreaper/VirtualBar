import { TestBed } from '@angular/core/testing';

import { RecipeIngredientsService } from './recipe-ingredients.service';

describe('RecipeIngredientsService', () => {
  let service: RecipeIngredientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeIngredientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

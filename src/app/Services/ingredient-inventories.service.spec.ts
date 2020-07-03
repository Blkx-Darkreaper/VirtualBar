import { TestBed } from '@angular/core/testing';

import { IngredientInventoriesService } from './ingredient-inventories.service';

describe('IngredientInventoriesService', () => {
  let service: IngredientInventoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientInventoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

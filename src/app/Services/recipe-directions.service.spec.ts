import { TestBed } from '@angular/core/testing';

import { RecipeDirectionsService } from './recipe-directions.service';

describe('RecipeDirectionsService', () => {
  let service: RecipeDirectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeDirectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

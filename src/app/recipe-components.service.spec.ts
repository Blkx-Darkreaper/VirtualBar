import { TestBed } from '@angular/core/testing';

import { RecipeComponentsService } from './recipe-components.service';

describe('RecipeComponentsService', () => {
  let service: RecipeComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

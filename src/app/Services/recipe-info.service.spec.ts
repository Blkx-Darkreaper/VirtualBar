import { TestBed } from '@angular/core/testing';

import { RecipeInfoService } from './recipe-info.service';

describe('RecipeInfoService', () => {
  let service: RecipeInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

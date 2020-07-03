import { TestBed } from '@angular/core/testing';

import { RecipeCategoriesService } from './recipe-categories.service';

describe('RecipeCategoriesService', () => {
  let service: RecipeCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

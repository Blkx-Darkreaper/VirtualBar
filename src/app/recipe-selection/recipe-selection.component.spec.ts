import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSelectionComponent } from './recipe-selection.component';

describe('RecipeSelectionComponent', () => {
  let component: RecipeSelectionComponent;
  let fixture: ComponentFixture<RecipeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

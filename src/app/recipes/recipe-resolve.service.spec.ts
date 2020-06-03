import { TestBed } from '@angular/core/testing';

import { RecipeResolveService } from './recipe-resolve.service';

describe('RecipeResolveService', () => {
  let service: RecipeResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RequirementService } from './requirement.service';

describe('RequirementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequirementService = TestBed.get(RequirementService);
    expect(service).toBeTruthy();
  });
});

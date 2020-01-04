import { TestBed } from '@angular/core/testing';

import { SemesterService } from './semester.service';

describe('SemesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SemesterService = TestBed.get(SemesterService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GoalServiceService } from './goal-service.service';

describe('GoalServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoalServiceService = TestBed.get(GoalServiceService);
    expect(service).toBeTruthy();
  });
});

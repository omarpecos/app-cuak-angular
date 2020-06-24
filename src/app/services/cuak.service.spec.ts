import { TestBed } from '@angular/core/testing';

import { CuakService } from './cuak.service';

describe('CuakService', () => {
  let service: CuakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

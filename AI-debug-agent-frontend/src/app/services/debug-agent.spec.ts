import { TestBed } from '@angular/core/testing';

import { DebugAgent } from './debug-agent';

describe('DebugAgent', () => {
  let service: DebugAgent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebugAgent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { BrokerageService } from './brokerage.service';

describe('BrokerageService', () => {
  let service: BrokerageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

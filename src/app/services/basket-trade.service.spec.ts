import { TestBed } from '@angular/core/testing';

import { BasketTradeService } from './basket-trade.service';

describe('BasketTradeService', () => {
  let service: BasketTradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasketTradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

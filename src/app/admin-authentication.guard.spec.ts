import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AdminAuthenticationGuard } from './admin-authentication.guard';

describe('adminAuthenticationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => AdminAuthenticationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

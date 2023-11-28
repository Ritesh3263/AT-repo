import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, mapToCanActivate } from '@angular/router';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  private readonly isAuthenticated = inject(UserService).isAuthenticated;
 
  constructor(private router: Router) {
    this.router = router;
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Promise<boolean> {
 
    if(!(await this.isAuthenticated())) {
      this.router.navigate(['']); // When user is not authenticated redirect to Login route
      return false;
    }
    return true;
  }
}
 
export const authenticatedGuard = mapToCanActivate([AuthenticationGuard]);  // Angular 16+ Standard - Guard Function instead of Guard Class
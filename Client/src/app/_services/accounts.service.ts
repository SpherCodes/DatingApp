import { LikesService } from './likes.service';
import { User } from './../_Models/User';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private http = inject(HttpClient);
  private LikesService = inject(LikesService);
  baseUrl = environment.apiUrl;
  CurrentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.CurrentUser();
    if (user && user.token) {
      const role =  JSON.parse(atob(user.token.split('.')[1])).role
      return Array.isArray(role) ? role : [role];
    }
    return [];
  })

  constructor() {
    console.log(this.CurrentUser());
  }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.CurrentUser.set(user);
    this.LikesService.getLikeIds();

  }

  logout() {
    localStorage.removeItem('user');
    this.CurrentUser.set(null);
  }
}

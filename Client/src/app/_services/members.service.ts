import { AccountsService } from './accounts.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_Models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  accountsService = inject(AccountsService);

  getMembers() {
    return this.http.get<Member[]>(
      this.baseUrl + 'users'
    );
  }

  getMember(username: string) {
    return this.http.get<Member>(
      this.baseUrl + 'users/' + username
    );
  }
}

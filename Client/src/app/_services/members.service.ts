import { AccountsService } from './accounts.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_Models/member';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  accountsService = inject(AccountsService);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users').subscribe({
      next: members => this.members.set(members),
    });

  }

  getMember(username: string) {
    const member = this.members().find(x => x.username === username);
    if (member !== undefined) return  of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {

    return this.http.put(this.baseUrl + 'users', member).pipe(
      tap(() => {
        this.members.update(members => members.map(x => x.username === member.username ? member : x));
      } )
    );
  }
}

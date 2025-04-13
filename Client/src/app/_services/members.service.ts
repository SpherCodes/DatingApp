import { UserParams } from './../_Models/userParams';
import { AccountsService } from './accounts.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_Models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_Models/photo';
import { PaginatedResult } from '../_Models/pagination';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  accountsService = inject(AccountsService);
  paginatedResults = signal<PaginatedResult<Member[]> | null>(null);
  memberCatch = new Map();
  user = this.accountsService.CurrentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams() {
    this.userParams.set(new UserParams(this.user));
  }

  getMembers() {
    const response = this.memberCatch.get(
      Object.values(this.userParams()).join('-')
    );

    if (response) {
      return setPaginatedResponse(response, this.paginatedResults);
    }

    let params = setPaginationHeaders(
      this.userParams().pageNumber,
      this.userParams().pageSize
    );

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http
      .get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
      .subscribe({
        next: (response) => {
          setPaginatedResponse(response, this.paginatedResults);
          this.memberCatch.set(
            Object.values(this.userParams).join('-'),
            response
          );
        },
      });
  }

  getMember(username: string) {
    const member: Member = [...this.memberCatch.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Member) => m.username === username);

    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {
    return this.http
      .put(this.baseUrl + 'users', member)
      .pipe
      // tap(() => {
      //   this.members.update(members => members.map(x => x.username === member.username ? member : x));
      // } )
      ();
  }
  setMainPhoto(photo: Photo) {
    return this.http
      .put(this.baseUrl + 'users/set-main-photo/' + photo.id, {})
      .pipe
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photoUrl === photo.url) {
      //       m.photoUrl = photo.url;
      //     }
      //     return m;
      //   }))
      // })
      ();
  }
  deletePhoto(photo: Photo) {
    return this.http
      .delete(this.baseUrl + 'users/delete-photo/' + photo.id)
      .pipe(
        tap(() => {
          // this.members.update(members => members.map(m => {
          //   if (m.photos.includes(photo)) {
          //     m.photos = m.photos.filter(p => p.id !== photo.id);
          //   }
          //   return m;
          // }))
        })
      );
  }
}

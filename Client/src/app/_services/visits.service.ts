import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_Models/pagination';
import { Visit } from '../_Models/visit';
import { setPaginationHeaders, setPaginatedResponse } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class VisitsService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedVisitResults = signal<PaginatedResult<Visit[]> | null>(null);
  paginatedVisitorResults = signal<PaginatedResult<Visit[]> | null>(null);
  getVisitors(
    pageNumber: number,
    pageSize: number,
    pastMonthOnly: boolean = false
  ) {
    console.log(
      `Fetching visitors - page: ${pageNumber}, size: ${pageSize}, pastMonth: ${pastMonthOnly}`
    );
    let params = setPaginationHeaders(pageNumber, pageSize);

    if (pastMonthOnly) {
      params = params.append('pastMonthOnly', 'true');
    }

    return this.http
      .get<Visit[]>(`${this.baseUrl}visits/visitors`, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          console.log('Visitors data received:', response);
          setPaginatedResponse(response, this.paginatedVisitorResults);
          console.log(
            'Paginated results updated:',
            this.paginatedVisitorResults()
          );
        },
        error: (error) => {
          console.error('Error fetching visitors:', error);
        },
      });
  }

  getVisited(
    pageNumber: number,
    pageSize: number,
    pastMonthOnly: boolean = false
  ) {
    console.log(
      `Fetching visited - page: ${pageNumber}, size: ${pageSize}, pastMonth: ${pastMonthOnly}`
    );
    let params = setPaginationHeaders(pageNumber, pageSize);

    if (pastMonthOnly) {
      params = params.append('pastMonthOnly', 'true');
    }

    return this.http
      .get<Visit[]>(`${this.baseUrl}visits/visits`, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          setPaginatedResponse(response, this.paginatedVisitResults);
          console.log('Visit data received:', this.paginatedVisitResults());
        },
        error: (error) => {
          console.error('Error fetching visited profiles:', error);
        },
      });
  }

  addVisit(visitedUserId: number) {
    return this.http.post(`${this.baseUrl}visits/${visitedUserId}`, {});
  }
}

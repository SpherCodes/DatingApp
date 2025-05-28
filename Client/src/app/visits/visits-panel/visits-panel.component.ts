import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { VisitsService } from '../../_services/visits.service';
import { Visit } from '../../_Models/visit';
import { VisitCardComponent } from '../visit-card/visit-card.component';

@Component({
  selector: 'app-visits-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonsModule,
    FormsModule,
    PaginationModule,
    VisitCardComponent,
  ],
  templateUrl: './visits-panel.component.html',
})
export class VisitsPanelComponent implements OnInit, OnDestroy {
  
  visitsService = inject(VisitsService);
  predicate = 'visitors';
  pageNumber = 1;
  pageSize = 5;
  timeFilter = 'all';

  ngOnInit(): void {
    this.loadVisits();
  }

  ngOnDestroy(): void {
    this.visitsService.paginatedVisitorResults.set(null);
    this.visitsService.paginatedVisitResults.set(null);
  }

  getTitle() {
    switch (this.predicate) {
      case 'visitors':
        return 'Who visited me';
      case 'visits':
        return 'Profiles I visited';
      default:
        return 'Profile Activity';
    }
  }

  loadVisits() {
    const pastMonthOnly = this.timeFilter === 'month';
    if (this.predicate === 'visitors') {
      this.visitsService.getVisitors(
        this.pageNumber,
        this.pageSize,
        pastMonthOnly
      );
    } else {
      this.visitsService.getVisited(
        this.pageNumber,
        this.pageSize,
        pastMonthOnly
      );
    }
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadVisits();
    }
  }

  onPredicateChange() {
    this.pageNumber = 1; // Reset to first page when switching tabs
    this.loadVisits();
  }

  onTimeFilterChange() {
    this.pageNumber = 1; // Reset to first page when changing time filter
    this.loadVisits();
  }

  getVisitItems(): Visit[] {
    if (this.predicate === 'visitors') {
      return this.visitsService.paginatedVisitorResults()?.items || [];
    } else {
      return this.visitsService.paginatedVisitResults()?.items || [];
    }
  }

  getPagination() {
    if (this.predicate === 'visitors') {
      return this.visitsService.paginatedVisitorResults()?.pagination;
    } else {
      return this.visitsService.paginatedVisitResults()?.pagination;
    }
  }
}

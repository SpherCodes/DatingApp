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
  styleUrl: './visits-panel.component.css',
})
export class VisitsPanelComponent implements OnInit, OnDestroy {
  visitsService = inject(VisitsService);
  predicate = 'visitors';
  pageNumber = 1;
  pageSize = 5;

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
    if (this.predicate === 'visitors') {
      this.visitsService.getVisitors(this.pageNumber, this.pageSize);
    } else {
      this.visitsService.getVisited(this.pageNumber, this.pageSize);
    }
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadVisits();
    }
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

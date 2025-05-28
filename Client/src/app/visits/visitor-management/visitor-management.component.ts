import { Component, inject } from '@angular/core';
import { Visit } from '../../_Models/visit';
import { User } from '../../_Models/User';
import { AccountsService } from '../../_services/accounts.service';
import { VisitsService } from '../../_services/visits.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaginatedResult, Pagination } from '../../_Models/pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visitor-management',
  standalone: true,
  imports: [RouterModule, CommonModule, PaginationModule, FormsModule],
  templateUrl: './visitor-management.component.html',
  styleUrl: './visitor-management.component.css',
})
export class VisitorManagementComponent {
  visitors: Visit[] = [];
  currentUser: User | null = null;
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 5;

  visitsService = inject(VisitsService);
  private accountService = inject(AccountsService);

  ngOnInit(): void {
    console.log('VisitorsComponent initialized');
    this.currentUser = this.accountService.CurrentUser();
    console.log(this.currentUser);
    if (this.currentUser) {
      this.loadVisitors();
    }
  }

  loadVisitors() {
    this.visitsService.getVisitors(this.pageNumber, this.pageSize)
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadVisitors();
    }
  }

  formatVisitDate(date: Date): string {
    const visitDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - visitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return visitDate.toLocaleDateString();
    }
  }
}

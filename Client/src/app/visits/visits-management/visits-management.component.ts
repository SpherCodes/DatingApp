import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Visit } from '../../_Models/visit';
import { User } from '../../_Models/User';
import { VisitsService } from '../../_services/visits.service';
import { AccountsService } from '../../_services/accounts.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visits-management',
  standalone: true,
  imports: [CommonModule, RouterModule,PaginationModule,FormsModule],
  templateUrl: './visits-management.component.html',
  styleUrl: './visits-management.component.css',
})
export class VisitsManagementComponent implements OnInit {
  visited: Visit[] = [];
  currentUser: User | null = null;
  pageNumber: number = 1;
  pageSize: number = 5;

  visitsService = inject(VisitsService);
  private accountService = inject(AccountsService);

  ngOnInit(): void {
    this.currentUser = this.accountService.CurrentUser();
    if (this.currentUser) {
      this.loadVisited();
    }
  }

  loadVisited() {
    this.visitsService.getVisited(this.pageNumber, this.pageSize)
  }

  pageChanged(event: any) {
    if(this.pageNumber !== event) {
      this.pageNumber = event;
      this.loadVisited();
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

import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Visit } from '../../_Models/visit';
import { VisitsService } from '../../_services/visits.service';

@Component({
  selector: 'app-visit-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './visit-card.component.html',
  styleUrl: './visit-card.component.css',
})
export class VisitCardComponent {
  @Input() visit: Visit | null = null;
  @Input() isVisitor = false;

  private visitsService = inject(VisitsService);
  visitMember() {
    if (this.visit) {
      this.visitsService.addVisit(this.visit.visitorId);
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

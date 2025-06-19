import { LikesService } from './../../_services/likes.service';
import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_Models/member';
import { RouterLink, Router } from '@angular/router';
import { PresenceService } from '../../_services/presence.service';
import { VisitsService } from '../../_services/visits.service';
import { AccountsService } from '../../_services/accounts.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  private visitService = inject(VisitsService);
  private accountService = inject(AccountsService);
  private router = inject(Router);

  member = input.required<Member>();
  hasLiked = computed(() =>
    this.likeService.likeIds().includes(this.member().id)
  );
  isOnline = computed(() =>
    this.presenceService.onlineUsers.includes(this.member().username)
  );
  isVip = computed(() => this.accountService.roles().includes('VIP'));

  toggleLike() {
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update((ids) =>
            ids.filter((x) => x !== this.member().id)
          );
        } else {
          this.likeService.likeIds.update((ids) => [...ids, this.member().id]);
        }
      },
    });
  }

  visitMember() {
    this.visitService.addVisit(this.member().id).subscribe({
      next: () => {
        console.log(`Visited ${this.member().username}`);
        this.router.navigate(['/members', this.member().username]);
      },
      error: (error) => {
        console.error('Error recording visit:', error);
        console.log(
          `Visited ${this.member().username} but failed to record visit.`
        );
        this.router.navigate(['/members', this.member().username]);
      },
    });
  }
}

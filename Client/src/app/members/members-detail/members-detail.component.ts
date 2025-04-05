import { ActivatedRoute } from '@angular/router';
import { MembersService } from './../../_services/members.service';
import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../_Models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule , DatePipe],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.css',
})
export class MembersDetailComponent implements OnInit {
  private membersService = inject(MembersService);
  private route = inject(ActivatedRoute);
  member?: Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.membersService.getMember(username).subscribe({
      next: (member) => {
        this.member = member;
        member.photos.map(p => {
          this.images.push(new ImageItem({ src: p.url, thumb: p.url }));
        });
      },
    });
  }
}

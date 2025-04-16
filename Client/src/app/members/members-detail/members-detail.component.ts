import { ActivatedRoute } from '@angular/router';
import { MembersService } from './../../_services/members.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_Models/member';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../../member/member-messages/member-messages.component";
import { Message } from '../../_Models/message';
import { MessageService } from '../../_services/message.service';

@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.css',
})
export class MembersDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent;
  private membersService = inject(MembersService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  messages: Message[] = [];

  ngOnInit(): void {

    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(p => {
          this.images.push(new ImageItem({ src: p.url, thumb: p.url }));
        });
      }
    })
    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] ? this.selectTab(params['tab']) : null
      }
    })
  }

  updateMessages(message: Message) {
    this.messages.push(message);
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  onTabActivated(data: TabDirective) {
    if (data.heading === 'Messages' && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: (messages) => {
          this.messages = messages;
        },
      })

    }
  }

  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if (!username) return;

  //   this.membersService.getMember(username).subscribe({
  //     next: (member) => {
  //       this.member = member;
  //       member.photos.map(p => {
  //         this.images.push(new ImageItem({ src: p.url, thumb: p.url }));
  //       });
  //     },
  //   });
  // }
}

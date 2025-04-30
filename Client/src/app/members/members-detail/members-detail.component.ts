import { PresenceService } from './../../_services/presence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from './../../_services/members.service';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_Models/member';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../../member/member-messages/member-messages.component";
import { Message } from '../../_Models/message';
import { MessageService } from '../../_services/message.service';
import { AccountsService } from '../../_services/accounts.service';
import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.css',
})
export class MembersDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent;
  PresenceService = inject(PresenceService);
  private messageService = inject(MessageService);
  private accountService = inject(AccountsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;

  ngOnInit(): void {

    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(p => {
          this.images.push(new ImageItem({ src: p.url, thumb: p.url }));
        });
      }
    })
    this.route.paramMap.subscribe({
      next: _=> this.onRouteParamsChange()
    })
    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] ? this.selectTab(params['tab']) : null
      }
    })
  }


  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  onRouteParamsChange(){
    const user = this.accountService.CurrentUser();
    if(!user) return;
    if(this.messageService.hubConnection?.state === HubConnectionState.Connected &&
      this.activeTab?.heading === 'Messages' )
  {
      this.messageService.hubConnection.stop().then(() => {
        this.messageService.createHubConnection(user, this.member.username); 
      })
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    this.router.navigate([],{
      relativeTo: this.route,
      queryParams: { tab: this.activeTab?.heading },
      queryParamsHandling: 'merge'
    })
    if (data.heading === 'Messages' && this.member) {
      const user = this.accountService.CurrentUser();
      if(!user) {
        this.messageService.stopHubConnection();
        return ;
      }
        this.messageService.createHubConnection(user, this.member.username);
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}

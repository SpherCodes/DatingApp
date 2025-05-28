import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { AccountsService } from '../../_services/accounts.service';
import { UserParams } from '../../_Models/userParams';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [ MemberCardComponent,PaginationModule,FormsModule,ButtonsModule],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css'
})
export class MemberListComponent implements OnInit {
memberService = inject(MembersService);
genderList = [{value:'male' ,display: 'Males'}, {value:'female', display: 'Females'}];


  ngOnInit(): void {
    if(!this.memberService.paginatedResults()){
      this.loadMembers();
    }
  }

  loadMembers(){
    this.memberService.getMembers()
  }

  resetFilters(){
    this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event:any){
    if(this.memberService.userParams().pageNumber !== event.page){
      this.memberService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }
  
}
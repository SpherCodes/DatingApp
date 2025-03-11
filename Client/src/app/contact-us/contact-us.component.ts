import { AccountsService } from './../_services/accounts.service';
import { Developer } from './../_Models/developer';
import { User } from './../_Models/User';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  accountsService = inject(AccountsService);
  developer: Developer = {
    developerName: 'Siphesihle Mvelase',
    developerEmail: '2021335696@ufs4life.ac.za',
    developerBio:
      'I am a full stack developer with experience in Angular, React, and Node.js.',
  };
}

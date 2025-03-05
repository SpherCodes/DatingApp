import { AccountsService } from './../_services/accounts.service';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  AccountsService = inject(AccountsService);

  Model: any = {};

  login() {
    console.log(this.Model);
    this.AccountsService.login(this.Model).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  logout() {
    this.AccountsService.logout();
  }
}

import { TitleCasePipe } from '@angular/common';
import { AccountsService } from './../_services/accounts.service';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive ,TitleCasePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  AccountsService = inject(AccountsService);
  private router = inject(Router);
  private toaster = inject(ToastrService);

  Model: any = {};

  login() {
    console.log(this.Model);
    this.AccountsService.login(this.Model).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/members');
      },
      error: (error: any) => {
        this.toaster.error(error.error);
      },
    });
  }

  logout() {
    this.AccountsService.logout();
    this.router.navigateByUrl('/');
  }
}

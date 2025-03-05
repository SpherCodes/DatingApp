import { AccountsService } from './_services/accounts.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavComponent, RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  private AccountsService = inject(AccountsService);


  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    console.log('Setting current user');
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    console.log(user);
    this.AccountsService.CurrentUser.set(user);
  }


}

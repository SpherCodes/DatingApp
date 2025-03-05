import { AccountsService } from './../_services/accounts.service';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private AccountsService = inject(AccountsService);
  cancelRegister = output<boolean>();
  model: any = {};

  register() {
    this.AccountsService.register(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
    }
  });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}

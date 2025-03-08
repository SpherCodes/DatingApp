import { AccountsService } from './../_services/accounts.service';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  private toaster = inject(ToastrService);

  register() {
    this.AccountsService.register(this.model).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        this.toaster.error(error.error);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}

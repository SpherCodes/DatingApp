import { inject } from '@angular/core';
import { AccountsService } from './../_services/accounts.service';
import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountsService = inject(AccountsService);
  const toastr = inject(ToastrService);

  if (accountsService.CurrentUser()) {
    return true;
  } else {
    toastr.error('You shall not pass!');
    return false;
  }
};

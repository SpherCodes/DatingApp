import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { AccountsService } from '../_services/accounts.service';

export const vipGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountsService);
  const toastr = inject(ToastrService);

  if (accountService.roles().includes('VIP')) {
    return true;
  } else {
    toastr.error('This feature is only available for VIP members');
    return false;
  }
};

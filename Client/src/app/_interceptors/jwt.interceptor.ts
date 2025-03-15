import { inject } from '@angular/core';
import { AccountsService } from './../_services/accounts.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const accountsService = inject(AccountsService);

  if(accountsService.CurrentUser()){
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${accountsService.CurrentUser()?.token}`
      }
    })
  }
  return next(req);
};

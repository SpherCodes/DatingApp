import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountsService } from '../_services/accounts.service';

@Directive({
  selector: '[appHasRole]', // *appHasRole='["Admin", "Moderator"]'
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  private accountService = inject(AccountsService);
  private viewContainerRef = inject(ViewContainerRef)
  private templateRef = inject (TemplateRef);

  ngOnInit(): void {
    if (this.accountService.roles()?.some((r:string) => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainerRef.clear(); // clear view if no role
    }
  }

}
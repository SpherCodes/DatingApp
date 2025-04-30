import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_Models/User';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  onlineUsers: string[] = [];

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (username) => {
      this.onlineUsers = [...this.onlineUsers, username];
    });

    this.hubConnection.on('UserIsOffLine', (username) => {
      this.onlineUsers = this.onlineUsers.filter((x) => x !== username);
    });

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsers = usernames;
    });

    this.hubConnection.on('NewMessageReceived', (data) => {
      console.log(data);
      this.toastr
        .info(data.knownAs + ' has sent you a message! Click me to see it')
        .onTap.pipe(take(1))
        .subscribe(() => {
          this.router.navigateByUrl(
            '/members/' + data.userName + '?tab=Messages'
          );
        });
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }
}

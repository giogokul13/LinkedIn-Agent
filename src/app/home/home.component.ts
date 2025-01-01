import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'LinkedIn-Agent';
  connected: boolean = false;

  
  public clientId = '86tjhta273brsv';
  public clientSecret = 'WPL_AP1.Lw4L599Zu6oeGqJ5.3Q77yA==';
  public redirectUri = encodeURIComponent("http://localhost:4200/login");
  public scopes = "openid profile w_member_social email"
  public memberId: string | undefined;
  private accessToken = '';

  constructor(private http: HttpClient) { }

  openAuthDialog() {
    window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${this.scopes}`, "_blank")
  }

  getAccessToken(code: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUri}&client_id=${this.clientId}&client_secret=${this.clientSecret}`;

    return this.http.post('https://www.linkedin.com/oauth/v2/accessToken', body, { headers }).toPromise().then((response: any) => {
      this.accessToken = response['access_token'];
    });
  }

  uploadMedia(media: File) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/octet-stream'
    });

    // return this.http.post('https://api.linkedin.com/mediaUploads', media, { headers }).toPromise().then((response: { [x: string]: { [x: string]: any; }; }) => {
    //   return response['value']['media'];
    // });
  }

  shareMedia(mediaId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    const body = {
      "author": `urn:li:person:${this.memberId}`,
      "lifecycleState": "PUBLISHED",
      "specificContent": {
        "com.linkedin.ugc.ShareContent": {
          "shareCommentary": {
            "text": "Your share commentary"
          },
          "shareMediaCategory": "ARTICLE",
          // "media": [
          //   {
          //     "media": `urn:li:digitalmediaAsset:${mediaId}`,
          //     "status": "READY",
          //     "title": {
          //       "text": "Your media title"
          //     }
          //   }
          // ]
        }
      },
      "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    return this.http.post('https://api.linkedin.com/ugcPosts', body, { headers }).toPromise();
  }
}

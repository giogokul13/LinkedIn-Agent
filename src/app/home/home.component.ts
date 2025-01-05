import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected connected: boolean = false;
  protected  loading: boolean = false;
  public clientId = '86tjhta273brsv';
  private baseURL: string = "http://localhost:4200/"
  public clientSecret = 'WPL_AP1.Lw4L599Zu6oeGqJ5.3Q77yA==';
  public redirectUri = encodeURIComponent("http://localhost:4200/login-callback");
  public scopes = "openid profile w_member_social email"
  public memberId: string | undefined;
  private accessToken = '';
  protected promptStr: string = "";
  protected previewStr: string = "";
  protected userInfo: any;
  protected userId: string = ""
  constructor(private http: HttpClient,
    private snackBar: MatSnackBar
  ) { 
    window.addEventListener("message", this.receiveMessageFromCallback.bind(this))
  }

  receiveMessageFromCallback(e: any) {
    console.log(e);
    let eventData = e.data || {};
    let message = JSON.parse(eventData);
    let code = message.code;
    this.getAccessToken(code);
  }

  openAuthDialog() {
    // this.getAccessToken(this.code);
    window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${this.scopes}`, "_blank")
  }

  getAccessToken(code: string) {
    this.loading = true;
    console.log("going to get token", code);
    let path = `api/auth/auth-tokens/${code}`;
    this.http.get(this.baseURL + path).subscribe((response: any) => {
      console.log("Token Response", response);
      let status = response.status;
      if(status == 200) {
        this.accessToken = response.token;
        this.userInfo = response.user;
        this.connected = true;
      } else {
        console.error("There was something wrong in completeing the authorization");
        this.snackBar.open("There is some serious issue at te backend ") 
      }
    this.loading = false;
    }, (error) => {
      console.error("There was something wrong in completeing the authorization", error)
      this.snackBar.open("There is some serious issue at the backend ");
    this.loading = false;

    });
  }

  generateContent(){
    this.loading = true;
    let path = "api/ai/generate-content";
    let body = {
      "prompt": this.promptStr
    }
    this.http.post(path, body).subscribe((response: any) => {
      console.log(response);
      if(response.status == 200) {
        this.previewStr = response.content;
      } else {
        this.snackBar.open("There is some serious issue at the backend to generate content, please try again after some time");
      }
      this.loading = false;
    }, (error) => {
      console.error("There was something wrong in completeing the content generation ", error);
      this.snackBar.open("There is some serious issue at the backend to generate content, please try again after some time");
      this.loading = false;
    })
  }

  postContent(){
    this.loading = true;
    let path = "api/linkedin/create";
    let body = {
      content: this.previewStr,
      uid: this.userId,
      accessToken: this.accessToken
    };

    this.http.post(path, body).subscribe((response: any) => {
      console.log(response);
      if(response.status == 200) {
        let post = response.post;
      } else {
        this.snackBar.open("There is some serious issue at the backend to post content, please try again after some time");
      }
      this.loading = false;
    }, (error) => {
      console.error("There was something wrong in completeing the posting ", error);
      this.snackBar.open("There is some serious issue at the backend to post content, please try again after some time");
      this.loading = false;
    })
  }
}

// You cannot get the refresh Token 
// https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens
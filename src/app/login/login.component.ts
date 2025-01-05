import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private routeData: ActivatedRoute){}

  ngOnInit(): void {
    let params = this.routeData.snapshot.queryParams;
    console.log(params);
    window.opener.postMessage(JSON.stringify(params), "*");
    window.parent.close();
  }

}

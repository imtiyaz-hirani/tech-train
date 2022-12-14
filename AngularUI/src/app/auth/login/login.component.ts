import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
 import { UserInfo } from 'src/models/UserInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  msg: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
       email : new FormControl('',[Validators.required,Validators.email]),
      password : new FormControl('',[Validators.required, Validators.minLength(4)])
    });
  }

  onFormSubmit(){
    let userInfo: UserInfo ={
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    let token = btoa(userInfo.email+':'+userInfo.password);
    this.userService.login(userInfo, token).subscribe({
      next:  (data)=>{
          localStorage.setItem('token',token );
          localStorage.setItem('role', data.role );
          localStorage.setItem('email', data.email );

          switch(data.role){
              case "CUSTOMER":
                this.router.navigateByUrl("/home");
                break;
              case "VENDOR":
                this.router.navigateByUrl("/vendor");
                break;
              case "ADMIN":
                this.router.navigateByUrl("/admin");
                break;
              default:
                localStorage.clear();
                this.router.navigateByUrl("/login");
                break;
          }
       },
      error: (error)=>{
        this.msg = 'Invalid Credentials';
        localStorage.clear();
      }
    });
  }


}

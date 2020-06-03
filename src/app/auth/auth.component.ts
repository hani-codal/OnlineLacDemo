import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { AuthService, AuthInterface } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error :string=null;
  constructor(private authService:AuthService,private route:Router) { }

  ngOnInit(): void {
  }

  switchTo(){
  this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form:NgForm){
  const email = form.value.email;
  const password =  form.value.password;
  this.isLoading= true;

let authObs :Observable<AuthInterface>;

  if(form.invalid){
    return;
  }
  if(this.isLoginMode){
   authObs=this.authService.logIn(email,password);
  }
  else{
    authObs = this.authService.signUp(email,password);
  }
  authObs.subscribe(resData=>{
    console.log(resData);
    this.isLoading=false;
    this.route.navigate(['/recipes']);
  },error=>{
    this.error = error;
    this.isLoading=false;
   })

  form.reset();
  }


}

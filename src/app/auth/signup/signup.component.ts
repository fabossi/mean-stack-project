import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => { this.isLoading = false; });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


  onSignUp(form: NgForm) {
    if (form.invalid) {
      return new Error('campos inválidos');
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)
    form.resetForm();
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'add-match-form',
  templateUrl: './add-match-form.component.html',
  styleUrls: ['./add-match-form.component.scss'],
})
export class AddMatchFormComponent implements OnInit {
  user: Object;
  registerForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public flashMessagesService: FlashMessagesService,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // this.checkLoggedIn();
    this.authService.getProfile().subscribe(
      data => {
        this.user = data.user;
      },
      err => {
        console.log(err);
        return false;
      }
    );

    this.registerForm = this.formBuilder.group({
      //controlname: ['initial value', rules]
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(14),
        ],
      ],
      teamNameA: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(14),
        ],
      ],
      teamNameB: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(14),
        ],
      ]
    });
  }

  checkLoggedIn(): void {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onRegisterSubmit(): void {
    this.authService.addNewMatch(this.registerForm.value).subscribe(data => {
      if (data.success == true) {
        this.flashMessagesService.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        this.router.navigate(['/chat']);
      } else {
        this.flashMessagesService.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
      }
    });
  }
}

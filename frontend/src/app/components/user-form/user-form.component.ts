import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!:FormGroup;
  isSubmit:boolean = false;
  constructor(
    private fb:FormBuilder,
    private http:HttpClient,
    private router:Router
  ){}

  ngOnInit(): void {
    this.prepareform();  
  }

  prepareform(){
      this.userForm = this.fb.group({
        name:['', [Validators.required, Validators.minLength(3)]],
        phone:['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        email:['',[Validators.required]],
        address:['',[Validators.required]],
      });
  }

  resetForm(){
    this.userForm.reset();
  }

  submitForm(){
    this.userForm.markAllAsTouched();
    const isValid = this.userForm.valid;
    if(!isValid){ return; }

    const data = this.userForm.value;
    this.isSubmit = true;
    setTimeout(() => {
      this.http.post('http://localhost:3000/users/addUser', data).subscribe({
        next: (response) => {
          this.isSubmit = false;
          // Redirect to '/users' after successful submission
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.isSubmit = false;
          console.error('API Error:', error);
        }
      });
    }, 2000);
  }
  
}

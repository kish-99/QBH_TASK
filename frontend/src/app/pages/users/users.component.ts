import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable  from 'jspdf-autotable';

interface User {
  _id: string;
  name: string;
  phone: number;
  email: string;
  address: string;
  createDate: string;
  updateDate: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm!:FormGroup;
  isSubmit:boolean = false;
  backgroundBlur:boolean = false;
  showPopup:boolean = false;
  selectedUser: User = {
    _id: '',
    name: '',
    phone: 0,
    email: '',
    address: '',
    createDate: '',
    updateDate: ''
  };

  isEditModalOpen = false;
  isDeleteModalOpen = false;

  constructor(private http: HttpClient, private fb:FormBuilder, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.fetchUsers();
    this.prepareform();  
  }

  fetchUsers(): void{
    this.http.get<User[]>('http://localhost:3000/users').subscribe({
      next: (response: User[]) => {
        this.users = [...response];
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  prepareform(){
    this.userForm = this.fb.group({
      _id: [''],
      name:['', [Validators.required, Validators.minLength(3)]],
      phone:['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email:['',[Validators.required]],
      address:['',[Validators.required]],
    });
}

  handleoOnSelectedUser(user: User): void{
    this.isSubmit = true;
    this.backgroundBlur = true;
    setTimeout(() => {
      this.selectedUser = {...user};
      this.userForm.patchValue({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address
      });
      this.isSubmit = false;
      this.showPopup = true;
    }, 1000)
    
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
    this.showPopup = false;
    this.backgroundBlur= true;
    this.http.patch(`http://localhost:3000/users/update/${this.userForm.value._id}`, data).subscribe({
      next:(response)=>{
        console.log(response);
      },
      error:(error)=>{
        console.log(error);
      }
    })
    setTimeout(() => {
      this.isSubmit = false;
      this.backgroundBlur = false;
      this.fetchUsers();
    }, 1000)
    
  }

  handleDeleteUser(): void{
    if(window.confirm("Do you want to delete the user?")){
      this.isSubmit= true;
      
      this.http.delete<User>(`http://localhost:3000/users/delete/${this.userForm.value._id}`).subscribe({
        next: (response) => {
          console.log('User deleted successfully', response);
        },
        error: (error) => {
          console.error('Error deleting user', error);
        }
      });

      setTimeout(() => {
        this.showPopup = false;
        this.isSubmit = false;
        this.backgroundBlur = false;
        this.fetchUsers();
      }, 1000)
      
    }    
  }

  closeForm(): void{
    this.showPopup = false;
    this.isSubmit = false;
    this.backgroundBlur = false;
  }

  downloadPDF(): void {
    const doc = new jsPDF();

    let rows: any[] = [];
    this.users.forEach((user, index) => {
      rows.push([index + 1, user.name, user.phone, user.email, user.address]);
    });

    autoTable(doc, {
      head: [['S No.', 'Name', 'Phone', 'Email', 'Address']],
      body: rows,
    });

    doc.save('users.pdf');
  }
  
}

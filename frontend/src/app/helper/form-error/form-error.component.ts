import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss']
})
export class FormErrorComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() control: any = '';
  @Input() controlName?: any = '';
  @Input() options?:any = {};

  messages:any =  {
    required: '{field} is required'
  };

ngOnInit() {}


  get formcontrol(){
    return this.form.controls[this.control].errors || {};
  }

  get formerror(){
    let control = this.form.controls[this.control];
    return Object.keys(control?.errors || {}).length && control.touched;
  }

  get errorsList(){
    let list:any = [];
    Object.keys(this.formcontrol).forEach((errorKey)=>{
      let errorType = this.formcontrol[errorKey];
      let error;

      if(this.options && this.options?.messages && this.options.messages[errorKey]){
        error = this.options.messages[errorKey];
      }else{
       error = '';
      }
      
      list.push(error);
    });
    return list.join('<br>');
  }

}
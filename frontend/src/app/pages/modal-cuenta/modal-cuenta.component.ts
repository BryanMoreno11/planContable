import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cuenta } from '../../interfaces/Cuenta';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-cuenta.component.html',
  styleUrl: './modal-cuenta.component.css'
})
export class ModalCuentaComponent {
  //Datos de entrada
  @Input() editMode:boolean=false;
  @Input() cuenta:Cuenta | null=null;
  @Input() codigoNivel:string="";
  //Salidas
  @Output() submitForm = new EventEmitter<Cuenta>();
  @Output() closeModal = new EventEmitter<void>();
  //atributos
  cuentaForm:FormGroup;

  constructor(private fb:FormBuilder) {
      this.cuentaForm = this.fb.group({
      cuenta_codigonivel: ['', Validators.required],
      cuenta_descripcion: ['', Validators.required],
      cuenta_esdebito: [true, Validators.required],
      cuenta_grupo: [''],  
      cuenta_idpadre: [null],  
      cuenta_codigopadre: [''],  
      cuenta_padredescripcion: ['']  
    });
  }
  //Eventos
  ngOnChanges() {
    if (this.editMode && this.cuenta) {
      this.cuentaForm.patchValue(this.cuenta);
    } else if (this.codigoNivel && this.cuenta) {
      const codigopadre = this.cuenta.cuenta_codigopadre
      ? `${this.cuenta.cuenta_codigopadre}.${this.cuenta.cuenta_codigonivel}`
      : `${this.cuenta.cuenta_codigonivel}`;
      this.cuentaForm.patchValue({
        cuenta_grupo: this.cuenta.cuenta_grupo, 
        cuenta_idpadre: this.cuenta.cuenta_id,
        cuenta_codigopadre: codigopadre,
        cuenta_codigonivel: this.codigoNivel,  
        cuenta_padredescripcion: this.cuenta.cuenta_descripcion
      });
    }else{
      this.cuentaForm.patchValue({ cuenta_codigonivel: this.codigoNivel });
    }
  }

  onSubmit() {
    if (this.cuentaForm.valid) {
      const formData = {
        ...this.cuentaForm.value,
        cuenta_descripcion: this.cuentaForm.value.cuenta_descripcion.toUpperCase()
      };
      this.submitForm.emit(formData);
    }
  }

  onClose() {
    this.closeModal.emit();
    this.cuentaForm.reset();
    this.cuentaForm.patchValue({ cuenta_esdebito: true });
  }




}

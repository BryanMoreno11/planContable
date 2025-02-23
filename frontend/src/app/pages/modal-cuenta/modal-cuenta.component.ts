import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cuenta } from '../../interfaces/Cuenta';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlancuentaService } from '../../services/plancuenta.service';

@Component({
  selector: 'app-modal-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-cuenta.component.html',
  styleUrl: './modal-cuenta.component.css'
})
export class ModalCuentaComponent implements OnInit {
  //Datos de entrada
  @Input() editMode:boolean=false;
  @Input() cuenta:Cuenta | null=null;
  @Input() codigoNivel:string="";
  //Salidas
  @Output() submitForm = new EventEmitter<Cuenta>();
  @Output() closeModal = new EventEmitter<void>();
  //atributos
  cuentaForm:FormGroup;

  constructor(private fb:FormBuilder, private _planCuentaService:PlancuentaService) {
      this.cuentaForm = this.fb.group({
      cuenta_id: [null],
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
  ngOnInit(): void {
    //Editar
    if (this.editMode && this.cuenta) {
      console.log("La cuenta que llego es ",this.cuenta);
      this.cuentaForm.patchValue(this.cuenta);
    } 
    //Crear una cuenta hija
    else if (this.codigoNivel && this.cuenta) {
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
    }
    //Creación de un grupo
    else{
      this.cuentaForm.patchValue({ cuenta_codigonivel: this.codigoNivel });
    }
  }


 

  crearCuenta(cuenta:Cuenta){
    this._planCuentaService.crearCuenta(cuenta).subscribe(
      {
        next:(data:any)=>{
         console.log("Cuenta creada con éxito", data);
        },
        error:(error)=>{
          console.log("Error al crear la cuenta", error);
        },
        complete:()=>{
         this.submitForm.emit(cuenta);

        }
      }
    );
  }

  modificarCuenta(cuenta:Cuenta){
    this._planCuentaService.actualizarCuenta(cuenta).subscribe(
      {
        next:(data:any)=>{
          console.log("Cuenta actualizada con éxito");
        },
        error:(error)=>{
          console.log("Error al crear la cuenta", error);
        },
        complete:()=>{
          console.log("Cuenta creada con éxito");
          this.submitForm.emit(cuenta);
        }
      }
    );
  }


  onSubmit() {
    if (this.cuentaForm.valid) {
      const formData: Cuenta = {
        ...this.cuentaForm.value,
        cuenta_descripcion: this.cuentaForm.value.cuenta_descripcion.toUpperCase()
      };
      if (this.editMode) {
        this.modificarCuenta(formData);
      } else {
        this.crearCuenta(formData);
      }
    }
  }

  onClose() {
    this.closeModal.emit();
    this.cuentaForm.reset();
    this.cuentaForm.patchValue({ cuenta_esdebito: true });
  }




}

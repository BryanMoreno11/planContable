import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { PlancuentaService } from '../../services/plancuenta.service';
import { Cuenta } from '../../interfaces/Cuenta';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-plancuenta',
  standalone: true,
  imports: [MatTreeModule,MatIconModule, MatButtonModule, FormsModule,
    ReactiveFormsModule
     
  ],
  templateUrl: './plancuenta.component.html',
  styleUrl: './plancuenta.component.css'
})
export class PlancuentaComponent implements OnInit {
  cuentaForm: FormGroup;
  isModalOpen = false;
  treeControl: FlatTreeControl<ExampleFlatNode>;
  dataNodes = new BehaviorSubject<ExampleFlatNode[]>([]);
  cuenta:Cuenta= { } as Cuenta;
  cuentaPadre: ExampleFlatNode | null= null;

  constructor(private _planCuentaService: PlancuentaService, private fb: FormBuilder) {
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(
      (node) => node.level,
      (node) => node.expandable
    );

    this.cuentaForm = this.fb.group({
      cuenta_codigonivel: ['', Validators.required],
      cuenta_descripcion: ['', Validators.required],
      cuenta_esdebito: [true, Validators.required]
    });



  }

  ngOnInit(): void {
    this.cargarNodosPrincipales();
  }

  cargarNodosPrincipales() {
    this._planCuentaService.getGrupos().subscribe(
      {
        next:(data:Cuenta[])=>{
          const nodes = data.map((item) => this._transformer(item, 0));
          this.dataNodes.next(nodes);
        },
        error:(error)=>{
          console.log("Error al cargar los nodos principales", error);
        },
        complete:()=>{
          console.log("Carga de nodos principales completada");
        }
      });
  }

  cargarHijos(nodo: ExampleFlatNode): void {

    if(nodo.expanded){
      this.eliminarCuentasHijasPadre(nodo);
      return;
    }

    if (!nodo.isLoading && nodo.expandable && !nodo.expanded) {
      nodo.isLoading = true;
        this._planCuentaService.getCuentas(nodo.id).subscribe({
          next:(hijos:Cuenta[]) =>{
           this.insertarCuentasHijasPadre(hijos, nodo);
            nodo.isLoading = false;
          },
          error: (error) => {
            nodo.isLoading = false;
          },
          complete: () => {
            nodo.isLoading = false;
          }
        }
          
        );
      }
  }


  exportarExcel(){
    this._planCuentaService.exportarCuenta().subscribe(
      {
        next:(data:Blob)=>{
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(data);
          a.download = 'PlanDeCuentas.xlsx';
          a.click();
          window.URL.revokeObjectURL(a.href);
          console.log('Excel generado con éxito');
        },
        error:(error)=>{
          console.log("Error al generar el Excel", error);
        },
        complete:()=>{
          console.log("Excel generado con éxito");
        }
      }
    )
  }


  obtenerCuenta(id_cuenta:number){
    this._planCuentaService.getCuenta(id_cuenta).subscribe((data) => {
      this.cuenta = data;
    });
  }

  private _transformer(node: Cuenta, level: number): ExampleFlatNode {
    return {
      id: node.cuenta_id,
      level: level,
      expandable: true,
      isLoading: false,
      expanded:false,
      cuenta: node
    };
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    
  /*region Métodos para el modal */
  
  openModal(cuentaPadre?:ExampleFlatNode) {
    this.isModalOpen = true;
    this.cuentaPadre=cuentaPadre || null;
    this.cuentaForm.get('cuenta_codigonivel')?.setValue(this.dataNodes.value.filter(n => n.level === 0).length+1);
    if(cuentaPadre && cuentaPadre.expanded){
      this.cuentaForm.get('cuenta_codigonivel')?.setValue(this.dataNodes.value.filter(n => n.cuenta.cuenta_idpadre === cuentaPadre.cuenta.cuenta_id
        && n.level === cuentaPadre.level+1
      ).length+1);
    }else if(cuentaPadre && !cuentaPadre.expanded){
      this._planCuentaService.getCuentas(cuentaPadre.cuenta.cuenta_id).subscribe(
        {
          next:(hijos:Cuenta[])=>{

            this.cuentaForm.get('cuenta_codigonivel')?.setValue(hijos.length+1);
          },
          error:(error)=>{
            console.log("Error al cargar los hijos", error);
          },
          complete:()=>{
            console.log("Carga de hijos completada");
          }
        }
      );

    }
  }




  closeModal() {
    console.log("Cerrando modal");  
    this.isModalOpen = false;
    this.cuentaPadre=null;
    this.cuentaForm.reset();
  }





  guardarCuenta() { 

    if(this.cuentaForm.valid){
      let cuenta:Cuenta= this.cuentaForm.value;
      cuenta.cuenta_descripcion=cuenta.cuenta_descripcion.toUpperCase();
      if(this.cuentaPadre){
        cuenta.cuenta_grupo=this.cuentaPadre.cuenta.cuenta_grupo;
        cuenta.cuenta_idpadre=this.cuentaPadre.cuenta.cuenta_id;
        cuenta.cuenta_codigopadre = this.cuentaPadre.cuenta.cuenta_codigopadre
        ? `${this.cuentaPadre.cuenta.cuenta_codigopadre}.${this.cuentaPadre.cuenta.cuenta_codigonivel}`
        : `${this.cuentaPadre.cuenta.cuenta_codigonivel}`;
              cuenta.cuenta_padredescripcion=this.cuentaPadre.cuenta.cuenta_descripcion;
      }
      
      this._planCuentaService.crearCuenta(cuenta).subscribe(
        {
          next:(data:any)=>{
          console.log("Cuenta creada con éxito", data);
            if(this.cuentaPadre){
              this._planCuentaService.getCuentas(this.cuentaPadre.cuenta.cuenta_id).subscribe(
                {
                  next:(hijos:Cuenta[])=>{
                    this.eliminarCuentasHijasPadre(this.cuentaPadre!);
                    this.insertarCuentasHijasPadre(hijos, this.cuentaPadre!);
                    this.closeModal();
                  },
                  error:(error)=>{
                    console.log("Error al cargar los hijos", error);
                  },
                  complete:()=>{
                    console.log("Carga de hijos completada");
                  }
                }
              );
            }else{
              this.cargarNodosPrincipales();
              this.closeModal();


            }
          },
          error:(error)=>{
            console.log("Error al crear la cuenta", error);
          },
          complete:()=>{
            console.log("Cuenta creada con éxito");

          }
        }
      );
  
    }
  }


  insertarCuentasHijasPadre(cuentasHijas:Cuenta[], nodoPadre:ExampleFlatNode){
    const currentData= this.dataNodes.getValue();
    const parentIndex = currentData.findIndex(n => n.id === nodoPadre.id);
    if (parentIndex !== -1) {
      const newNodes = cuentasHijas.map((hijo:any) => this._transformer(hijo, nodoPadre.level+1));
      currentData.splice(parentIndex + 1, 0, ...newNodes);
      this.dataNodes.next([...currentData]); 
      nodoPadre.expanded=true; 
    }
  }


  eliminarCuentasHijasPadre(nodoPadre:ExampleFlatNode){
    const currentData = this.dataNodes.getValue();
    const parentIndex = currentData.findIndex(n => n.id === nodoPadre.id);
    if (parentIndex !== -1) {
      let removeCount=0;
      for(let i= parentIndex+1; i<currentData.length;i++){
        if(currentData[i].level<=nodoPadre.level){
          break;
        }
        removeCount++;
      }
      currentData.splice(parentIndex+1, removeCount);
      this.dataNodes.next([...currentData]);
      nodoPadre.expanded=false;
    }

  }




    




}


interface ExampleFlatNode {
  expandable: boolean;
  level: number;
  id: number;
  isLoading:boolean;
  expanded:boolean;
  cuenta:Cuenta;
  
}

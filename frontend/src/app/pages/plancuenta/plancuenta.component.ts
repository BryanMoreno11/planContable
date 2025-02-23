import { Component,  OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { PlancuentaService } from '../../services/plancuenta.service';
import { Cuenta } from '../../interfaces/Cuenta';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FormBuilder} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalCuentaComponent } from '../modal-cuenta/modal-cuenta.component';



@Component({
  selector: 'app-plancuenta',
  standalone: true,
  imports: [MatTreeModule,MatIconModule, MatButtonModule, FormsModule,
    ReactiveFormsModule, ModalCuentaComponent
     
  ],
  templateUrl: './plancuenta.component.html',
  styleUrl: './plancuenta.component.css'
})
export class PlancuentaComponent implements OnInit {
  isModalOpen = false;
  codigoNivel: string = '';
  cuenta:Cuenta= { } as Cuenta;
  cuentaSeleccionada: ExampleFlatNode | null= null;
  editCuenta:boolean=false;
  treeControl: FlatTreeControl<ExampleFlatNode>;
  dataNodes = new BehaviorSubject<ExampleFlatNode[]>([]);
  

  constructor(private _planCuentaService: PlancuentaService, private fb: FormBuilder) {
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(
      (node) => node.level,
      (node) => node.expandable
    );
  }

  ngOnInit(): void {
    this.cargarNodosPrincipales();
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
          next:(res) =>{
            let hijos = res as Cuenta[];
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

  
  async openModal( ) {
    if (!this.editCuenta) {
      this.codigoNivel = await this.setCodigoNivel(this.cuentaSeleccionada ?? null);
    }
    this.isModalOpen = true;
  }
  
  async setCodigoNivel(cuentaPadre: ExampleFlatNode | null):Promise<string> {
    const getCodigoFaltante = (codigos: string[], raiz:boolean): string => {
      const numeros = codigos
        .map(codigo => parseInt(codigo, 10))
        .sort((a, b) => a - b);
  
      let esperado = 1;
      for (const num of numeros) {
        if (num !== esperado) {
          return raiz==true?esperado.toString():esperado < 10 ? esperado.toString().padStart(2, '0') : esperado.toString();
        }
        esperado++;
      }
      return raiz==true?esperado.toString():  esperado < 10  ? esperado.toString().padStart(2, '0') : esperado.toString();
    };
  
    if (!cuentaPadre) {
      // Si no hay cuentaPadre, se obtienen los nodos raíz
      const nodosRaiz = this.dataNodes.value.filter(n => n.level === 0);
      const codigos = nodosRaiz.map(n => n.cuenta.cuenta_codigonivel);
      const codigoNivel = getCodigoFaltante(codigos, true);
      return codigoNivel;
    }
  
    if (cuentaPadre.expanded) {
      // Si está expandida, se obtienen los hijos mediante el arreglo de nodos
      const nodosHijos = this.dataNodes.value.filter(
        n => n.cuenta.cuenta_idpadre === cuentaPadre.cuenta.cuenta_id &&
             n.level === cuentaPadre.level + 1
      );
      const codigos = nodosHijos.map(n => n.cuenta.cuenta_codigonivel);
      const codigoNivel = getCodigoFaltante(codigos, false);
      return codigoNivel;
    } else {
      try {
        const hijos = await firstValueFrom(this._planCuentaService.getCuentas(cuentaPadre.cuenta.cuenta_id)) as Cuenta[];
        const codigos = hijos.map(hijo => hijo.cuenta_codigonivel);
        const codigoNivel = getCodigoFaltante(codigos, false);
        return codigoNivel;
      } catch (error) {
        console.error("Error al cargar los hijos de la cuenta", cuentaPadre.cuenta.cuenta_id, error);
    }
  }
  return "";
}

  closeModal() {
    this.isModalOpen = false;
  }



  handleSubmit(cuenta: Cuenta) {
    this.cargarResultados(cuenta);
  }



  cargarResultados(cuenta:Cuenta){

    if(cuenta.cuenta_idpadre==null){
      this.cargarNodosPrincipales();
      this.closeModal();
    }else{
      this._planCuentaService.getCuentas(cuenta.cuenta_idpadre).subscribe(
        {
          next:(res)=>{
            let hijos = res as Cuenta[];
            let cuentaPadre=this.dataNodes.value.find(n => n.cuenta.cuenta_id === Number(cuenta.cuenta_idpadre));
            this.eliminarCuentasHijasPadre(cuentaPadre!);
            this.insertarCuentasHijasPadre(hijos, cuentaPadre!);
          },
          error:(error)=>{
            console.log("Error al cargar los hijos", error);
          },
          complete:()=>{
            console.log("Carga de hijos completada");
            this.closeModal();
          }
        }
      )
    }

  }


  eliminarCuenta(cuenta:Cuenta){
    this._planCuentaService.eliminarCuenta(cuenta.cuenta_id).subscribe(
      {
        next:(data:any)=>{
          console.log("Cuenta eliminada con éxito");
        },
        error:(error)=>{
          console.log("Error al eliminar la cuenta", error);
        },
        complete:()=>{
          console.log("Cuenta eliminada con éxito");
          this.cargarResultados(cuenta);
          this.closeModal();
        }
      }
    );
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

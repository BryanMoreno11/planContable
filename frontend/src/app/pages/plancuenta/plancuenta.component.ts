import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { PlancuentaService } from '../../services/plancuenta.service';
import { Cuenta, Nodo_Cuenta } from '../../interfaces/Cuenta';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-plancuenta',
  standalone: true,
  imports: [MatTreeModule,MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './plancuenta.component.html',
  styleUrl: './plancuenta.component.css'
})
export class PlancuentaComponent implements OnInit {

  treeControl: FlatTreeControl<ExampleFlatNode>;
  dataNodes = new BehaviorSubject<ExampleFlatNode[]>([]);
  cuenta:Cuenta= { } as Cuenta;

  constructor(private _planCuentaService: PlancuentaService) {
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(
      (node) => node.level,
      (node) => node.expandable
    );
  }

  ngOnInit(): void {
    this.cargarNodosPrincipales();
  }

  cargarNodosPrincipales() {
    this._planCuentaService.getGrupos().subscribe(
      {
        next:(data:Nodo_Cuenta[])=>{
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
      nodo.expanded = false;
      const currentData = this.dataNodes.getValue();
      const parentIndex = currentData.findIndex(n => n.id === nodo.id);
      if (parentIndex !== -1) {
        let removeCount=0;
        for(let i= parentIndex+1; i<currentData.length;i++){
          if(currentData[i].level<=nodo.level){
            break;
          }
          removeCount++;
        }
        currentData.splice(parentIndex+1, removeCount);
        this.dataNodes.next([...currentData]);
      }
      return;
    }

    if (!nodo.isLoading && nodo.expandable && !nodo.expanded) {
      nodo.isLoading = true;
        nodo.expanded=true;
        this._planCuentaService.getCuentas(nodo.id).subscribe({
          next:(hijos:Nodo_Cuenta[]) =>{
            const currentData = this.dataNodes.getValue();
            const parentIndex = currentData.findIndex(n => n.id === nodo.id);
            
            if (parentIndex !== -1) {
              const newNodes = hijos.map((hijo:any) => this._transformer(hijo, nodo.level+1));
              currentData.splice(parentIndex + 1, 0, ...newNodes);
              this.dataNodes.next([...currentData]);  
              console.log("Los nodos son ", currentData);
            }
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
      console.log("La data es ", data);
      this.cuenta = data;
      console.log("La cuenta es ", this.cuenta);
    });
  }

  private _transformer(node: Nodo_Cuenta, level: number): ExampleFlatNode {
    return {
      id: node.cuenta_id,
      name: node.texto,
      level: level,
      expandable: true,
      isLoading: false,
      expanded:false,
    };
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    
    







    




}


interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: number;
  isLoading:boolean;
  expanded:boolean;
  
}

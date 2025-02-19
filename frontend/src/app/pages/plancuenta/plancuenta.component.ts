import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { PlancuentaService } from '../../services/plancuenta.service';
import { Cuenta } from '../../interfaces/Cuenta';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-plancuenta',
  standalone: true,
  imports: [MatTreeModule,MatIconModule, MatButtonModule],
  templateUrl: './plancuenta.component.html',
  styleUrl: './plancuenta.component.css'
})
export class PlancuentaComponent implements OnInit {

  treeControl: FlatTreeControl<ExampleFlatNode>;
  dataNodes = new BehaviorSubject<ExampleFlatNode[]>([]);

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
    this._planCuentaService.getGrupos().subscribe((data) => {
      const nodes = data.map((item) => this._transformer(item, 0));
      this.dataNodes.next(nodes);
    });
  }

  cargarHijos(nodo: ExampleFlatNode): void {

    if(nodo.expanded==true){
      this.treeControl.collapse(nodo);
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
        this._planCuentaService.getCuentas(nodo.id).subscribe(
          (hijos) => {
            const currentData = this.dataNodes.getValue();
            const parentIndex = currentData.findIndex(n => n.id === nodo.id);
            
            if (parentIndex !== -1) {
              const newNodes = hijos.map(hijo => this._transformer(hijo, nodo.level+1));
              currentData.splice(parentIndex + 1, 0, ...newNodes);
              this.dataNodes.next([...currentData]);  
              console.log("Los nodos son ", currentData);
            }
            nodo.isLoading = false;
          },
          (error) => {
            nodo.isLoading = false;
          }
        );
      }
  }

  private _transformer(node: Cuenta, level: number): ExampleFlatNode {
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

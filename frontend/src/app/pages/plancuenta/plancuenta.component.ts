import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { PlancuentaService } from '../../services/plancuenta.service';
import { Cuenta } from '../../interfaces/Cuenta';

@Component({
  selector: 'app-plancuenta',
  standalone: true,
  imports: [MatTreeModule,MatIconModule],
  templateUrl: './plancuenta.component.html',
  styleUrl: './plancuenta.component.css'
})
export class PlancuentaComponent implements OnInit {

  constructor(private _planCuentaService:PlancuentaService)  {
  }

  cargarNodosPrincipales() {
    this._planCuentaService.getGrupos().subscribe(data => {
     this.dataSource.data = data;
    });
  }

  ngOnInit(): void {
    this.cargarNodosPrincipales();
  }



  private _transformer = (node: Cuenta, level: number) => {
    return {
      expandable: true,
      name: node.texto,
      level: level,
      id:node.cuenta_id,
      isLoading: false,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children || []
  );

  dataSource = new MatTreeFlatDataSource(
    this.treeControl, this.treeFlattener);



  hasChild = (_: number, 
    node: ExampleFlatNode) => node.expandable;


    cargarHijos(nodo: ExampleFlatNode): void {
      if (!nodo.isLoading && nodo.expandable) {
        nodo.isLoading = true;
        this._planCuentaService.getCuentas(nodo.id).subscribe(
          (hijos) => {
            const index = this.dataSource.data.findIndex((n) => n.cuenta_id === nodo.id);
            if (index !== -1) {
              console.log("se encontro el nodo padre");
              this.dataSource.data[index].children = hijos; // Asigna los hijos
              this.dataSource.data = [...this.dataSource.data]; // Actualiza la fuente de datos
              this.treeControl.expand(this.treeControl.dataNodes[nodo.level]); // Expande el nodo Padre
            }

            nodo.isLoading = false;
          },
          (error) => {
            nodo.isLoading = false;
          }
        );
      }
    }

  
    
    







    




}


interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: number;
  isLoading:boolean;
}

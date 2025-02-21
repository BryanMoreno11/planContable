import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuenta, Cuenta_Grupo } from '../interfaces/Cuenta';


@Injectable({
  providedIn: 'root'
})
export class PlancuentaService {

  constructor(private _httpClient: HttpClient) { }
  private API_URL = 'http://localhost:3000/api/';

  getGrupos() {
    return this._httpClient.get<any>(`${this.API_URL}cuentas/grupos`);
  }

  getCuentas(id_padre:number) {
    return this._httpClient.get<any>(`${this.API_URL}cuentas/hijas/${id_padre}`);
  }


  getCuenta(id_cuenta:number) {
    return this._httpClient.get<any>(`${this.API_URL}cuenta/${id_cuenta}`);
  }

  exportarCuenta(){
    return this._httpClient.get(`${this.API_URL}/cuentas/exportar`,
      {
        responseType: 'blob'
      }


    );
  }

  crearCuenta(cuenta:Cuenta_Grupo | Cuenta){
    return this._httpClient.post(`${this.API_URL}/cuentas`,cuenta);

  }



}

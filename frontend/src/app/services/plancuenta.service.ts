import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuenta } from '../interfaces/Cuenta';


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
    return this._httpClient.get(`${this.API_URL}cuentas/hijas/${id_padre}`);
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

  crearCuenta(cuenta: Cuenta){
    return this._httpClient.post<any>(`${this.API_URL}/cuentas`,cuenta);

  }

  actualizarCuenta(cuenta: Cuenta){
    return this._httpClient.put(`${this.API_URL}/cuentas`,cuenta);
  }

  eliminarCuenta(id_cuenta:number, id_cuenta_padre:number){
    return this._httpClient.delete(`${this.API_URL}/cuentas/${id_cuenta}/${id_cuenta_padre}`);
  }



}

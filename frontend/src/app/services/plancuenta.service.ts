import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta } from '../interfaces/Cuenta';


@Injectable({
  providedIn: 'root'
})
export class PlancuentaService {

  constructor(private _httpClient: HttpClient) { }

  getGrupos(): Observable<Cuenta[]> {
    return this._httpClient.get<Cuenta[]>('http://localhost:3000/api/cuentas/grupos');
  }

  getCuentas(id_padre:number): Observable<Cuenta[]> {
    return this._httpClient.get<Cuenta[]>(`http://localhost:3000/api/cuentas/hijas/${id_padre}`);
  }


  getCuenta(id_cuenta:number): Observable<Cuenta[]> {
    return this._httpClient.get<Cuenta[]>(`http://localhost:3000/api/cuentas/hijas/${id_cuenta}`);
  }



}

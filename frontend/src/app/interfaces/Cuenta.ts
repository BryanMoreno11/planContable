export interface Nodo_Cuenta {
    cuenta_id: number;
    texto: string;
  }

  export interface Cuenta {
    cuenta_id: number;
    cuenta_grupo: string;
    cuenta_idpadre: number;
    cuenta_codigopadre: string;
    cuenta_padre: string;
    cuenta_codigonivel: string;
    cuenta_descripcion: string;
    cuenta_naturaleza: string;
  }
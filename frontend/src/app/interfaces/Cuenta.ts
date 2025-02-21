export interface Nodo_Cuenta {
    cuenta_id: number;
    texto: string;
  }

  export interface Cuenta {
    cuenta_id: number;
    cuenta_grupo: string;
    cuenta_idpadre: number;
    cuenta_codigopadre: string;
    cuenta_padredescripcion: string;
    cuenta_codigonivel: string;
    cuenta_descripcion: string;
    cuenta_esdebito: boolean;
  }

  export interface Cuenta_Grupo {
    cuenta_codigonivel:string,
    cuenta_descripcion: string,
    cuenta_esdebito: boolean
  }


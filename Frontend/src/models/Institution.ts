export interface Institution {
  id: number;
  name: string;
  idmenutype: number;
  location: string; // Rua + nº
  freguesia?: string;
  municipio?: string;
}
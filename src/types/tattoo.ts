export interface Tattoo {
  id: string;
  nome: string;
  estilo: string;
  preco: number;
  status: 'disponível' | 'vendida';
  url_marca_agua: string;
  url_original: string;
  comprada_por?: string;
  created_at: string;
  updated_at: string;
}

export interface Compra {
  id: string;
  user_id: string;
  tattoo_id: string;
  data_compra: string;
  valor: number;
}
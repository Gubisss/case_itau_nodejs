export interface Cliente {
    id?: number;
    nome: string;
    email: string;
    saldo: number;
}

export interface OperacaoFinanceira {
    valor: number;
}
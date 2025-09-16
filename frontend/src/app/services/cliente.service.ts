import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, OperacaoFinanceira } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  buscarClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
  }

  criarCliente(cliente: Cliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  atualizarCliente(id: number, cliente: Cliente): Observable<any> {
    return this.http.put(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  deletarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`);
  }
  
  // Método privado para gerar a idempotency-key
  private generateIdempotencyKey(): string {
    // Retorna a data atual + um número aleatório como string base36 para ser único
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  realizarDeposito(id: number, operacao: OperacaoFinanceira): Observable<any> {
    const headers = { 'Idempotency-Key': this.generateIdempotencyKey() };
    return this.http.post(`${this.apiUrl}/clientes/${id}/depositar`, operacao, { headers });
  }

  realizarSaque(id: number, operacao: OperacaoFinanceira): Observable<any> {
    const headers = { 'Idempotency-Key': this.generateIdempotencyKey() };
    return this.http.post(`${this.apiUrl}/clientes/${id}/sacar`, operacao, { headers });
  }
}
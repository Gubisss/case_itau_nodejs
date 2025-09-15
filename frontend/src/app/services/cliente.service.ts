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

  realizarDeposito(id: number, operacao: OperacaoFinanceira): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/${id}/depositar`, operacao);
  }

  realizarSaque(id: number, operacao: OperacaoFinanceira): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/${id}/sacar`, operacao);
  }
}
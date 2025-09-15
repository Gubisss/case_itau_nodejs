import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteDialogComponent } from '../dialogs/cliente-dialog.component';
import { OperacaoDialogComponent } from '../dialogs/operacao-dialog.component';

@Component({
  selector: 'app-cliente-lista',
  template: `
    <div class="container">
      <h2>Clientes</h2>
      
      <button mat-raised-button color="primary" (click)="abrirDialogNovoCliente()">
        Novo Cliente
      </button>

      <table mat-table [dataSource]="clientes" class="mat-elevation-z8">
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let cliente">{{cliente.id}}</td>
        </ng-container>

        <!-- Nome Column -->
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let cliente">{{cliente.nome}}</td>
        </ng-container>

        <!-- Email Column -->
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let cliente">{{cliente.email}}</td>
        </ng-container>

        <!-- Saldo Column -->
        <ng-container matColumnDef="saldo">
          <th mat-header-cell *matHeaderCellDef>Saldo</th>
          <td mat-cell *matCellDef="let cliente">{{cliente.saldo | currency:'BRL'}}</td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let cliente">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="abrirDialogDeposito(cliente)">
                <mat-icon>add</mat-icon>
                <span>Depositar</span>
              </button>
              <button mat-menu-item (click)="abrirDialogSaque(cliente)">
                <mat-icon>remove</mat-icon>
                <span>Sacar</span>
              </button>
              <button mat-menu-item (click)="abrirDialogEditar(cliente)">
                <mat-icon>edit</mat-icon>
                <span>Editar</span>
              </button>
              <button mat-menu-item (click)="confirmarExclusao(cliente)">
                <mat-icon>delete</mat-icon>
                <span>Excluir</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    table {
      width: 100%;
      margin-top: 20px;
    }

    .mat-elevation-z8 {
      box-shadow: 0 2px 4px rgba(0,0,0,.24);
    }
  `]
})
export class ClienteListaComponent implements OnInit {
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['id', 'nome', 'email', 'saldo', 'acoes'];

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar clientes', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  abrirDialogNovoCliente() {
    const dialogRef = this.dialog.open(ClienteDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.criarCliente(result).subscribe({
          next: () => {
            this.snackBar.open('Cliente criado com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarClientes();
          },
          error: (error) => {
            this.snackBar.open('Erro ao criar cliente: ' + error.error?.error || 'Erro desconhecido', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  abrirDialogEditar(cliente: Cliente) {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      data: cliente
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.atualizarCliente(cliente.id!, result).subscribe({
          next: () => {
            this.snackBar.open('Cliente atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarClientes();
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar cliente: ' + error.error?.error || 'Erro desconhecido', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  abrirDialogDeposito(cliente: Cliente) {
    const dialogRef = this.dialog.open(OperacaoDialogComponent, {
      data: { tipo: 'deposito' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.realizarDeposito(cliente.id!, result).subscribe({
          next: () => {
            this.snackBar.open('Depósito realizado com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarClientes();
          },
          error: (error) => {
            this.snackBar.open('Erro ao realizar depósito: ' + error.error?.error || 'Erro desconhecido', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  abrirDialogSaque(cliente: Cliente) {
    const dialogRef = this.dialog.open(OperacaoDialogComponent, {
      data: { tipo: 'saque' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.realizarSaque(cliente.id!, result).subscribe({
          next: () => {
            this.snackBar.open('Saque realizado com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarClientes();
          },
          error: (error) => {
            this.snackBar.open('Erro ao realizar saque: ' + error.error?.error || 'Erro desconhecido', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  confirmarExclusao(cliente: Cliente) {
    const confirmacao = confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`);
    if (confirmacao) {
      this.clienteService.deletarCliente(cliente.id!).subscribe({
        next: () => {
          this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarClientes();
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir cliente: ' + error.error?.error || 'Erro desconhecido', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
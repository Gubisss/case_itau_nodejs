import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Cliente</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field appearance="fill">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" required>
          <mat-error *ngIf="form.get('nome')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
          <mat-error *ngIf="form.get('email')?.hasError('required')">
            Email é obrigatório
          </mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">
            Email inválido
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!form.valid">
        {{ data ? 'Atualizar' : 'Criar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 350px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class ClienteDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente | null
  ) {
    this.form = this.fb.group({
      nome: [data?.nome || '', [Validators.required]],
      email: [data?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-operacao-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.tipo === 'deposito' ? 'Depositar' : 'Sacar' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field appearance="fill">
          <mat-label>Valor</mat-label>
          <input matInput type="number" formControlName="valor" required>
          <mat-error *ngIf="form.get('valor')?.hasError('required')">
            Valor é obrigatório
          </mat-error>
          <mat-error *ngIf="form.get('valor')?.hasError('min')">
            Valor deve ser maior que zero
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!form.valid">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class OperacaoDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OperacaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipo: 'deposito' | 'saque' }
  ) {
    this.form = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]]
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
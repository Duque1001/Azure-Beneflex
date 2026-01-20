import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthzService } from '../services/authz.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-menu',
  template: `
    <h2>Menú</h2>

    <div *ngIf="loading">Cargando...</div>

    <div *ngIf="!loading">
      <button>Días disponibles</button>
      <button *ngIf="canApprovals">Aprobaciones</button>
    </div>
  `
})
export class MenuComponent {
  canApprovals = false;
  loading = true;

  constructor(private authz: AuthzService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.canApprovals = await this.authz.hasRole('Approver');
    } catch (e) {
      console.error('Error en MenuComponent ngOnInit:', e);
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // ✅ fuerza refresco de vista (muy útil con SSR/hidratación)
    }
  }
}

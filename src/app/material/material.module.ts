import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

const MaterialComponents = [
  MatFormFieldModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatInputModule,
  MatTooltipModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...MaterialComponents],
  exports: [CommonModule, ...MaterialComponents]
})
export class MaterialModule { }

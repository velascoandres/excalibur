import { PrimaryGeneratedColumn } from 'typeorm';

export class EntidadPrincipal {
  @PrimaryGeneratedColumn()
  id: number | undefined;
}

import { PrimaryGeneratedColumn } from 'typeorm';

export class PrincipalEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;
}

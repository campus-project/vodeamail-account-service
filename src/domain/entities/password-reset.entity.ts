import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'timestamp' })
  expired_at: string;

  @UpdateDateColumn()
  updated_at: string;
}

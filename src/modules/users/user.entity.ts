import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Column({ type: 'varchar', length: 36, primary: true })
  id: string;

  @Column({ name: 'user_name', nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ name: 'phone_number', unique: true, nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: 'user' })
  role: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'password_reset_token', nullable: true })
  passwordResetToken: string;

  @Column({ name: 'password_reset_expiry', type: 'timestamp', nullable: true })
  passwordResetExpiry: Date;

  @Column({ name: 'email_verify', default: false })
  emailVerify: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiry: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

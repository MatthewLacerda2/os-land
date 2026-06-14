import { UserRole } from '../entities/user.entity';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}

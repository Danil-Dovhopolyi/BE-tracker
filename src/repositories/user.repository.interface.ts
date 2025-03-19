import { User } from "src/entities/user.entity";

export default interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  deleteById(id: string): Promise<void>;
}

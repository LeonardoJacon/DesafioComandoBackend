import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

export class AuthService {
constructor(private prisma: PrismaClient) {}

async register(email:string, senha:string, nome:string){
const existingUser = await this.prisma.usuario.findUnique({where:{email}});
if (existingUser) {
  throw new AppError("Email já está em uso!", 409);
}
const hashedPassword = await bcrypt.hash(senha,10);
const user = await this.prisma.usuario.create({
  data: {
    nome,
    email,
    senha: hashedPassword,
     }
     })
     return {id: user.id, nome: user.nome, email: user.email};
    }
    async login(email:string, senha:string){
        const user = await this.prisma.usuario.findUnique({where:{email}});
        if (!user) {
          throw new AppError("Email e/ou senha inválidos.", 401);
        }
        const passwordCorrect = await bcrypt.compare(senha, user.senha);
        if (!passwordCorrect) {
          throw new AppError("Email e/ou senha inválidos.", 401);
        }
        const token = generateToken(user.id);
        return {token};

    }
}
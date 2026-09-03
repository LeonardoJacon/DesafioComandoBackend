import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";

export class AuthService {
constructor(private prisma: PrismaClient) {}

async register(email:string, senha:string, nome:string){
const existingUser = await this.prisma.usuario.findUnique({where:{email}});
if (existingUser) {
  throw new Error("Email já está em uso!");
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
            throw new Error("Usuário não encontrado! (Email e/ou senha inválidos.)");
        }
        const passwordCorrect = await bcrypt.compare(senha, user.senha);
        if (!passwordCorrect) {
            throw new Error("Senha incorreta! (Email e/ou senha inválidos.)");
        }
        const token = generateToken(user.id);
        return {token};

    }
}
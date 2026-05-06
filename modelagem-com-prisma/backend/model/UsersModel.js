const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class UsersModel {
    static async findAll () {
        try {
            const result = await prisma.user.findMany();

            if (result.length === 0) {
                return { success: true, data: null, message: 'Nenhum usuario cadastrado.' };
            }

            return { success: true, data: result }
        } catch (error) {
            return { success: false, data: null, message: `Erro ao listar usuarios: ${error.message}` };
        }
    }

    static async findById (id) {
        try {
            /* 
            Nota: Você não pode usar select e include no mesmo nível. Se quiser selecionar campos do usuário e também trazer posts, 
            você deve colocar a seleção dos posts dentro de um select ou usar apenas o include para trazer tudo.
            */

            //Conversão, o id chega como string então precisamos converter para numero e base decimal para evitar erros
            const userId = parseInt(id, 10);

            const result = await prisma.user.findUnique({
                // Aqui usamos o where, verificamos se o id do banco de dados e igual ao id da requisição
                where: { id: userId }, 
                include: {
                    posts: true
                }
            });

            if (result === null) {
                return { success: false, data: null, message: 'Usuario não cadastrado.' };
            }

            return { success: true, data: result }
        } catch (error) {
            return { success: false, data: null, message: `Erro ao listar usuario: ${error.message}` };
        }
    }

    static async createUser (email, name) {
        try {
            const emailExist = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (emailExist) {
                return { success: false, data: null, message: 'Email informado já existente.' }
            }
            
            const result = await prisma.user.create({
                data: { 
                    name: name,
                    email: email
                }
            });
    
            return { success: true, data: result, message: `Usuario ${name} cadastrado com sucesso!` }
        } catch (error) {
            //Verificação para ver se da race condition, ou seja se mesmo passar pela findUnique, vai dar um erro no banco
            //o erro e o P2002, VIOLAÇÃO DE CHAVE UNICA DUPLICADA, aqui tratamos esse codigo
            if (error.code === 'P2002') {
                return { 
                    success: false, 
                    data: null, 
                    message: `Email informado já existente: ${error.message}.`
                };
            }

            return { success: false, data: null, message: `Erro ao cadastrar usuario: ${error.message}` };
        }
    }

    static async updateUser (id, name, email) {
        try {
            //Conversão, o id chega como string então precisamos converter para numero e base decimal para evitar erros
            const userId = parseInt(id, 10);

            const userExist = await prisma.user.findUnique({
                // Aqui usamos o where, verificamos se o id do banco de dados e igual ao id da requisição
                where: { id: userId }
            });

            if (userExist === null) {
                return { success: false, data: null, message: 'Usuario não cadastrado.' };
            }

            //Verificação para ver se há algo para atualizar
            const updates = {};
            if (name !== undefined) updates.name = name;
            if (email !== undefined) updates.email = email;

            //Verificação para ver se nada foi passado para atualizar
            if (Object.keys(updates).length === 0) {
                return { success: false, data: null, message: 'Nenhum campo fornecido para atualizar.' };
            }

            const result = await prisma.user.update({
                data: updates,
                where: {
                    id: userId
                }
            });

            return { success: true, data: result, message: `Usuario ${name} atualizado com sucesso.` }
        } catch (error) {
            //Verificação para ver se da race condition, ou seja se mesmo passar pela findUnique, vai dar um erro no banco
            //o erro e o P2002, VIOLAÇÃO DE CHAVE UNICA DUPLICADA, aqui tratamos esse codigo
            if (error.code === 'P2002') {
                return { 
                    success: false, 
                    data: null, 
                    message: `Email informado já existente: ${error.message}.` 
                };
            }

            return { success: false, data: null, message: `Erro ao atualizar usuario: ${error.message}` };
        }
    }

    static async deleteUser (id) {
        try {
            //Conversão, o id chega como string então precisamos converter para numero e base decimal para evitar erros
            const userId = parseInt(id, 10);

            const userExist = await prisma.user.findUnique({
                // Aqui usamos o where, verificamos se o id do banco de dados e igual ao id da requisição
                where: { id: userId }
            });

            if (userExist === null) {
                return { success: false, data: null, message: 'Usuario não cadastrado.' };
            }

            const nameUser = userExist.name;

            await prisma.user.delete({
                where: {
                    id: userId
                }
            });

            return { success: true, message: `Usuario ${nameUser} deletado com sucesso!` }
        } catch (error) {
            return { success: false, data: null, message: `Erro ao deletar usuario: ${error.message}` };
        }
    }
}

module.exports = UsersModel
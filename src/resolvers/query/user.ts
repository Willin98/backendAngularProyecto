import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import { findElements, findOneElement } from '../../lib/db-operations';
import { IUser } from '../../interfaces/user.interface';

const resolversUserQuery : IResolvers = {
    Query: {
        async users(_, __, { db }){
            try{
                return {
                    status: true,
                    message: 'Lista de usuarios cargada correctamente',
                    users: await findElements(db, COLLECTIONS.USERS),
                }; 
            }catch (error){
                console.log(error);
                return{
                    status: false,
                    message: 'Error al cargar los usuarios',
                    users: []
                };
            }
        },

        async login(_,{email, password}, { db }){
            try{
                const user : IUser = await findOneElement(db, COLLECTIONS.USERS, {email}) as unknown as IUser;
                if( user === null){
                    return{
                        status: false,
                        message: 'Usuario no existe',
                        token: null,
                    };
                }
                
                const passwordCheck = bcrypt.compareSync(password, user.password!);

                if(passwordCheck !== null){
                    delete user.password;
                    delete user.birthday;
                    delete user.registerDate;
                }
                return {
                    status: true,
                    message: !passwordCheck ? 'Password y usuario no correctos': 
                    'El usuario se logueo correctamente',
                    token:
                    !passwordCheck ? null: 
                    new JWT().sing({ user }, EXPIRETIME.H24), 
                    
                }; 
            }catch (error){
                console.log(error);
                return{
                    status: false,
                    message: 'Error al cargar el usuario',
                    token: null,
                };
            }
        },

        me(_, __, { token }){
            console.log(token);
            let info = new JWT().verify(token);
            if(info === MESSAGES.TOKEN_VERICATION_FAILED){
                return {
                    status: false,
                    message: info,
                    user: null
                };
            }
            return {
                status: true,
                message: 'Usuario autenticado correctamente mediante el token',
                user: Object.values(info)[0]
            };
        }
    },
};

export default resolversUserQuery;
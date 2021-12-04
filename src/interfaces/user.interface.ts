export interface Iuser{
    id?: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    registerDate: string;
    birthday: string;
    role: string;
}


registerDate: String!
"Fecha de Nacimiento"
birthday: String!
"Permisos del usuario"
role: Role!
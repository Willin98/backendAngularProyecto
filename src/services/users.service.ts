import { COLLECTIONS, EXPIRETIME, MESSAGES } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { IUser } from "../interfaces/user.interface";
import { asignDocumentId, findOneElement } from "../lib/db-operations";
import ResolversOperationsService from "./resolvers-operations.service";
import bcrypt from "bcrypt";
import JWT from "../lib/jwt";

class UsersService extends ResolversOperationsService {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  //Lista de usuarios
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, "usuarios", page, itemsPage);
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }
  //Autenticarnos
  async auth() {
    let info = new JWT().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_VERICATION_FAILED) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: "Usuario autenticado correctamente mediante el token",
      user: Object.values(info)[0],
    };
  }
  //Iniciar Sesion
  async login() {
    try {
      const variables = this.getVariables().user;
      const user: IUser = (await findOneElement(this.getDb(), this.collection, {
        email: variables?.email,
      })) as unknown as IUser;
      if (user === null) {
        return {
          status: false,
          message: "Usuario no existe",
          token: null,
        };
      }

      const passwordCheck = bcrypt.compareSync(
        variables?.password || "",
        user.password || ""
      );

      if (passwordCheck !== null) {
        delete user.password;
        delete user.birthday;
        delete user.registerDate;
      }
      return {
        status: passwordCheck,
        message: !passwordCheck
          ? "Password y usuario no correctos"
          : "El usuario se logueo correctamente",
        token: !passwordCheck ? null : new JWT().sing({ user }, EXPIRETIME.H24),
        user: !passwordCheck ? null : user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "Error al cargar el usuario",
        token: null,
      };
    }
  }
  //Registrar un usuario
  async register() {
    const user = this.getVariables().user;
    //Comprobar que user no es null
    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido, procura definirlo",
        user: null,
      };
    }
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ""
    ) {
      return {
        status: false,
        message: "Usuario sin password correcto",
        user: null,
      };
    }
    //Comprobar que el usuario no existe
    const userCheck = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });

    if (userCheck !== null) {
      return {
        status: false,
        message: `El email ${user?.email} ya se encuentra registrado`,
        user: null,
      };
    }

    //Comprobar el ultimo usuario registrado para asignar ID
    user!.id = await asignDocumentId(this.getDb(), this.collection, {
      key: "registerDate",
      order: -1,
    });

    //Asignar la fecha en formato ISO en la propiedad registerDate
    user!.registerDate = new Date().toISOString();

    //Encriptar password
    user!.password = bcrypt.hashSync(user!.password || "", 10);

    const result = await this.add(this.collection, user || {}, "usuario");
    //Guardar el documento (registro) en la coleccion
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  //Modificar un usuario
  async modify() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido, procura definirlo",
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(
      this.collection,
      filter,
      user || {},
      "usuario"
    );
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  //Borrar el usuario
  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === "") {
      return {
        status: false,
        message:
          "Identificador del usuario no definido, procura definirlo para eliminarlo",
        user: null,
      };
    }
    const result = await this.del(this.collection, { id }, "usuario");
    return {
      status: result.status,
      message: result.message,
    };
  }
}

export default UsersService;

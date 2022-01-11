import { IPaginationOptions } from "./../interfaces/pagination-options.interface";
import { Db, SortDirection } from "mongodb";

/**
 * Obtener el ID que vamos a utilizar en el nuevo usuario
 * @param database Base de datos con la que estamos trabajando
 * @param collection COlleccion donde queremos buscar el ultimo elemento
 * @param sort Como queremos ordenarlo { <propiedad>: -1}
 * @returns
 */
export const asignDocumentId = async (
  database: Db,
  collection: string,
  sort: { key: string; order: SortDirection } = {
    key: "registerDate",
    order: -1,
  }
) => {
  //Comprobar el ultimo usuario registrado para asignar ID
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort.key, sort.order as SortDirection)
    .toArray();
  if (lastElement.length === 0) {
    return "1";
  }
  return String(+lastElement[0].id + 1);
};

export const findOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return database.collection(collection).findOne(filter);
};

export const insertOneElement = async (
  database: Db,
  collection: string,
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

export const updateOneElement = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object
) => {
  return await database
    .collection(collection)
    .updateOne(filter, { $set: updateObject });
};

export const deleteOneElement = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).deleteOne(filter);
};

export const insertManyElements = async (
  database: Db,
  collection: string,
  documents: Array<object>
) => {
  return await database.collection(collection).insertMany(documents);
};

export const findElements = async (
  database: Db,
  collection: string,
  filter: object = {},
  paginationOptions: IPaginationOptions = {
    page: 1,
    pages: 1,
    itemsPage: -1,
    skip: 0,
    total: -1,
  }
) => {
  if (paginationOptions.total === -1) {
    return await database.collection(collection).find(filter).toArray();
  }
  return await database
    .collection(collection)
    .find(filter)
    .limit(paginationOptions.itemsPage)
    .skip(paginationOptions.skip)
    .toArray();
};

export const countElements = async (database: Db, collection: string) => {
  return await database.collection(collection).countDocuments();
};

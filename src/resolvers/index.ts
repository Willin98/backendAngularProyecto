import query  from './query';
import mutation from './mutation';
import { IResolvers } from 'graphql-tools';
import type from './type';
const resolvers : IResolvers = {
    ...query,
    ...mutation,
    ...type
};

export default resolvers;
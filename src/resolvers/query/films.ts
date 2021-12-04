import { IResolvers } from 'graphql-tools';

const resolversFilmsQuery : IResolvers = {
    Query: {
        films(){
            return true;
        }
    },
};

export default resolversFilmsQuery;
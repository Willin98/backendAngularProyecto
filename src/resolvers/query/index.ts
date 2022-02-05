import GMR from 'graphql-merge-resolvers';
import resolversShopFilmsQuery from './shop-film';
import resolversGenreQuery from './genre';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversShopFilmsQuery,
    resolversGenreQuery
]);

export default queryResolvers;
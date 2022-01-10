import GMR from 'graphql-merge-resolvers';
import resolversFilmsQuery from './films';
import resolversGenreQuery from './genre';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversFilmsQuery,
    resolversGenreQuery
]);

export default queryResolvers;
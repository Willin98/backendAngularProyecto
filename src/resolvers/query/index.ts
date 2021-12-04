import GMR from 'graphql-merge-resolvers';
import resolversFilmsQuery from './films';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversFilmsQuery,
]);

export default queryResolvers;
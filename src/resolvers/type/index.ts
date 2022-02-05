import GMR from 'graphql-merge-resolvers';
import resolversPlatformType from './platform';
import resolversShopFilmType from './shop-films';

const typeResolvers = GMR.merge([
    resolversShopFilmType,
    resolversPlatformType
]);

export default typeResolvers;


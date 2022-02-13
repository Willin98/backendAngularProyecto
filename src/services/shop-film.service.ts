import { COLLECTIONS, ACTIVE_VALUES_FILTER } from '../config/constants';
import ResolversOperationsService from './resolvers-operations.service';

class ShopFilmsService extends ResolversOperationsService {
  collection = COLLECTIONS.SHOP_FILM;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }

  async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE, platform: string = '') {
    let filter: object = { active: {$ne: false}}; 
    if(active === ACTIVE_VALUES_FILTER.ALL){
      filter = {};
    }else if(active === ACTIVE_VALUES_FILTER.INACTIVE){
      filter = { active: false }; 
    }
    if (platform !== '' && platform !== undefined) {
      filter = {...filter, ...{platform_id: platform}};
    }
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      'peliculas en cartelera',
      page,
      itemsPage, 
      filter
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      shopFilms: result.items,
    };
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      shopFilm: result.item,
    };
  }
}

export default ShopFilmsService;

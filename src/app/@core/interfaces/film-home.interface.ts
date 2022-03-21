export interface IFilmCarousel {
    id: string;
    name: string;
    description: string;
    background: string;
}

export interface IfilmItem {
    id: string;
    name: string;
    description: string;
    poster: string;
    stock: number;
    price: number;
    qty?: number;
    img: string;
    platform?: string;
}

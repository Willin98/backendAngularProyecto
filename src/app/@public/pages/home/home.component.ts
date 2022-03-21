import { IfilmItem } from '@core/interfaces/film-home.interface';
import { Router } from '@angular/router';
import { FilmsService } from '@core/services/films.service';
import { UsersService } from '@core/services/users.service';
import { Component, OnInit } from '@angular/core';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { loadData, closeAlert } from '@shared/alerts/alerts';
import { CartService } from '@film/core/services/cart.service.ts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //fimlItems: Array<IMenuItem> = shopFilmItems;
  items;
  listTwo;
  film: IfilmItem;
  constructor(private usersApi: UsersService, private films: FilmsService, private router: Router, private cartService: CartService) {}
  
  ngOnInit(): void {
    loadData('Cargando informacion', '');
    this.films.getBy(
      1, 10, ACTIVE_FILTERS.ACTIVE
    ).subscribe(result => {
      console.log('peliculas en cartelera', result);
      this.items = result;
      this.listTwo = result;
    });
    this.usersApi.getUsers(2,1).subscribe((result) => {
      console.log(result);
      url: '/film/details/'.concat(result.id);
    });
    closeAlert();
  }
  
  open(i: number) {
  }

  showDetails(item: IfilmItem) {
    console.log('deatlesssss', item.id);
    this.router.navigate(['/films/details', +item.id]);
  }

  addToCart(item: IfilmItem) {
    this.cartService.manageFilm(item);
  }

}

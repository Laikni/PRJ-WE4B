import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderLine } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'https://api.mon-gamestore.com/cart';
  
  // Gestion locale et réactive du panier
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedCart = localStorage.getItem('gamestore_cart');
    if (savedCart) this.cartItemsSubject.next(JSON.parse(savedCart));
  }

  // Ajoute un élément au panier côté client
  addToCart(game: any): void {
    const currentItems = this.cartItemsSubject.value;
    const existing = currentItems.find(item => item.id === game.id_jeu);

    if (existing) {
      existing.quantity += 1;
    } else {
      currentItems.push({ id: game.id_jeu, title: game.titre, quantity: 1, price: game.prix, stock: game.stock });
    }

    this.saveAndPublish(currentItems);
  }

  // Traduit CartController::checkout() (Envoi du JSON via HTTP POST)
  checkout(): Observable<{ success: boolean; error?: string }> {
    const payload = { cart: this.cartItemsSubject.value };
    return this.http.post<{ success: boolean; error?: string }>(`${this.apiUrl}/checkout.php`, payload);
  }

  // Traduit CartController::myOrders()
  getMyOrders(): Observable<OrderLine[]> {
    return this.http.get<OrderLine[]>(`${this.apiUrl}/my-orders.php`);
  }

  clearCart(): void {
    this.saveAndPublish([]);
  }

  private saveAndPublish(items: any[]): void {
    localStorage.setItem('gamestore_cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }
}
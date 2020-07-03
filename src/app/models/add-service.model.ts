export class AddService {
  isAdmin: boolean;
  meals: number[];
  beverages: number[];
  shoppingItems: number[];

  constructor(isAdmin: boolean, meals: number[], beverages: number[], shoppingItems: number[]) {
    this.isAdmin = isAdmin;
    this.meals = meals;
    this.beverages = beverages;
    this.shoppingItems = shoppingItems;
  }

}

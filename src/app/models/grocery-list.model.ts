export interface GroceryList {
  id: string;
  name: string;
  menu: { [day: number]: string};
}

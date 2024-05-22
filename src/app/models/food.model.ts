export interface FoodItem {
  selected: boolean;
  id?: string;
  title: string;
  price: number;
  description: string;
  categoryId: string;
  image: string; 
  hidden?: boolean;
}
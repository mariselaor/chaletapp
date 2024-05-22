export interface FoodItem {
  id?: string;
  title: string;
  price: number;
  description: string;
  categoryId: string;
  image: string; // Agrega la propiedad 'image' al modelo de Food
}
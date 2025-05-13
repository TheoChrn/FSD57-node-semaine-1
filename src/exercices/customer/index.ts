import { updateArrWithTTC } from "exercices/customer/utils";

export type Brand = {
  name: string;
  priceHT: number;
  priceTTC: string | null;
};

const priceHT: Brand[] = [
  { name: "Apple", priceHT: 1.0, priceTTC: null },
  { name: "Orange", priceHT: 1.2, priceTTC: null },
  { name: "Rasberry", priceHT: 2.5, priceTTC: null },
];
console.log(priceHT);
updateArrWithTTC(priceHT);

console.log(priceHT);

import { Brand } from "exercices/customer";

const caculateTTC = (priceHT: number) => (priceHT * 1.2).toFixed(2);

export const updateArrWithTTC = (brands: Brand[]) =>
  brands.forEach((brand) => (brand.priceTTC = caculateTTC(brand.priceHT)));

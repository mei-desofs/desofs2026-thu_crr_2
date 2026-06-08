const UnitEnum = {
  Grama: "g",
  Kilo: "kg",
  Litro: "L",
  Mililitro: "mL",
  Unidade: "unit",
} as const;

const PartialUnitEnum = {
  kg: "kg",
  l: "L",
  unit: "unit",
} as const;

type UnitEnum = typeof UnitEnum[keyof typeof UnitEnum];

export { UnitEnum };
export { PartialUnitEnum };

// Interface para usar em FarmerProduct ou outros
export interface Unit {
  id?: number;       // opcional no frontend
  name: UnitEnum;
}

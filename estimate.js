// Modelo orientativo por superficie relativa. No calcula capacidad estructural.
export function estimate(input, rates) {
  const { product, wood, treatment, reinforcement } = input;
  const length = Number(input.length), width = Number(input.width), height = Number(input.height), quantity = Number(input.quantity);
  if (![length, width, height, quantity].every(Number.isFinite) ||
      length < 20 || length > 400 || width < 20 || width > 300 ||
      height < 8 || height > 300 || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000) return null;
  if (!['pallet', 'crate'].includes(product) || !['pine', 'mixed', 'hardwood', 'advice'].includes(wood)) return null;
  // La fumigación y madera por definir requieren evaluación, no un precio ficticio.
  if (treatment === 'chemical' || wood === 'advice') return { review: true };
  if (!['heat', 'advice'].includes(treatment)) return null;
  const area = product === 'crate'
    ? (length * width + length * height + width * height) / 32000
    : length * width / 12000 * (0.85 + height / 100);
  const base = product === 'crate' ? rates.crateBase : rates.palletBase;
  const unit = Math.round((base * area * rates[wood] + (treatment === 'heat' ? rates.heat : 0) + (reinforcement ? rates.reinforcement : 0)) / 100) * 100;
  return { unit, low: Math.round(unit * quantity * 0.85), high: Math.round(unit * quantity * 1.2) };
}

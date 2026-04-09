/**
 * Scales a nutritional or ingredient amount string by a multiplier.
 * Handles fractions (1/2), mixed numbers (1 1/2), decimals (1.5), and unicode fractions (½).
 */
export function scaleAmount(amount: string, multiplier: number): string {
  if (multiplier === 1 || !amount) return amount;
  
  // 1. Normalize unicode vulgar fractions to standard fractions
  const vulgarMap: { [key: string]: string } = {
    '¼': ' 1/4', '½': ' 1/2', '¾': ' 3/4', '⅓': ' 1/3', '⅔': ' 2/3',
    '⅕': ' 1/5', '⅖': ' 2/5', '⅗': ' 3/5', '⅘': ' 4/5', '⅙': ' 1/6', '⅚': ' 5/6',
    '⅛': ' 1/8', '⅜': ' 3/8', '⅝': ' 5/8', '⅞': ' 7/8'
  };

  let normalized = amount;
  Object.entries(vulgarMap).forEach(([vulgar, standard]) => {
    normalized = normalized.replace(new RegExp(vulgar, 'g'), standard);
  });

  // 2. Clean up multiple spaces created by normalization
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // 3. Regex to match numbers: mixed numbers, fractions, or decimals/integers
  const regex = /(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)/g;
  
  return normalized.replace(regex, (match) => {
    let val: number;
    
    if (match.includes(' ') && match.includes('/')) {
      // Mixed number "1 1/2"
      const [whole, frac] = match.split(/\s+/);
      const [num, den] = frac.split('/').map(Number);
      val = Number(whole) + (num / den);
    } else if (match.includes('/')) {
      // Simple fraction "1/2"
      const [num, den] = match.split('/').map(Number);
      val = num / den;
    } else {
      // Decimal or integer "1.5" or "2"
      val = Number(match);
    }
    
    const scaled = val * multiplier;
    
    // 4. Try to simplify common fractions for the "Editorial" aesthetic
    const tolerance = 0.01;
    const isNear = (v: number, target: number) => Math.abs(v - target) < tolerance;
    
    if (isNear(scaled % 1, 0)) return Math.round(scaled).toString();
    if (isNear(scaled % 1, 0.5)) return `${Math.floor(scaled) > 0 ? Math.floor(scaled) + ' ' : ''}1/2`;
    if (isNear(scaled % 1, 0.25)) return `${Math.floor(scaled) > 0 ? Math.floor(scaled) + ' ' : ''}1/4`;
    if (isNear(scaled % 1, 0.75)) return `${Math.floor(scaled) > 0 ? Math.floor(scaled) + ' ' : ''}3/4`;
    if (isNear(scaled % 1, 0.33)) return `${Math.floor(scaled) > 0 ? Math.floor(scaled) + ' ' : ''}1/3`;
    if (isNear(scaled % 1, 0.66)) return `${Math.floor(scaled) > 0 ? Math.floor(scaled) + ' ' : ''}2/3`;

    return scaled.toFixed(2).replace(/\.?0+$/, '');
  });
}

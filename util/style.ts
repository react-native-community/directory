export function strippedBackground(stripeColor: string) {
  return {
    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${stripeColor} 20px, ${stripeColor} 40px)`,
  };
}

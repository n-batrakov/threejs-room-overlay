const isProduction = (import.meta as any).env.PROD;

export const asset = (file: string) => isProduction
  ? `../../assets/${file}`
  : `../../public/assets/${file}`;

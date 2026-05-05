export type Consultant = {
  id: number;
  slug: string;
  name: string;
  title: string | null;
  phone?: string | null;
  email?: string | null;
  region: string | null;
  avatar?: string | null;
  activePortfolioCount: number;
  salePortfolioCount: number;
  rentPortfolioCount: number;
};

export type ProductCategory =
  | "Earrings"
  | "Stud Earrings"
  | "Hoops"
  | "Drop Earrings"
  | "Pendant"
  | "Chains"
  | "Bracelets"
  | "Charm Bracelets"
  | "Bangles"
  | "Rings"
  | "Anklets"
  | "Hair Clips"
  | "Hair Pins"
  | "Brooches"
  | "Bookmarks"
  | "Keychains"
  | "Coasters"
  | "Trays"
  | "Clocks"
  | "Wall Frames"
  | "Wedding Keepsakes"
  | "Bouquet Preservation"
  | "Gift Boxes"
  | "Resin Letters"
  | "Corporate Gifts";

export type ChainType = "Snake Chain" | "Box Chain" | "Rolo Chain" | "Figaro Chain" | "Cord";
export type ChainLength = '16 inch' | '18 inch' | '20 inch' | '24 inch';
export type MetalColor = "Gold" | "Silver" | "Rose Gold";
export type FlakeType = "Gold Flakes" | "Silver Flakes" | "Rose Gold Flakes" | "None";
export type FinishType = "Gloss Finish" | "Matte Finish" | "Transparent Resin";
export type PackagingOption = "Standard Packaging" | "Gift Wrap" | "Premium Box" | "Luxury Box";

export interface CustomizationSelection {
  chainType?: ChainType;
  chainLength?: ChainLength;
  metalColor?: MetalColor;
  pendantShape?: string;
  flowerSelection?: string;
  flowerColor?: string;
  flakes?: FlakeType;
  backgroundFinish?: FinishType;
  customText?: string;
  customInitials?: string;
  uploadedImageUrl?: string;
  uploadedBouquetUrl?: string;
  uploadedHandwritingUrl?: string;
  giftMessage?: string;
  packaging?: PackagingOption;
  additionalPriceINR: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  priceINR: number;
  compareAtPriceINR?: number;
  inventoryQuantity: number;
  metalColor?: MetalColor;
  size?: string;
  shape?: string;
  weightGrams?: number;
  dimensionsCm?: string;
  barcode?: string;
  qrCodeUrl?: string;
  images: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  category: ProductCategory;
  collections: string[];
  basePriceINR: number;
  compareAtPriceINR?: number;
  rating: number;
  reviewCount: number;
  isCustomizable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  flowerDetails?: string;
  resinType?: string;
  materials?: string[];
  careGuide?: string[];
  images: string[];
  variants: ProductVariant[];
  defaultVariantId?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant: ProductVariant;
  customization?: CustomizationSelection;
  quantity: number;
  totalPriceINR: number;
}

export interface Banner {
  id: string;
  type: "Homepage Banner" | "Festival Banner" | "Offer Banner" | "Category Banner" | "Collection Banner" | "Sticky Banner" | "Floating Banner" | "Popup Banner";
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  desktopImageUrl: string;
  tabletImageUrl?: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
}

import { BusinessNiche, BusinessNicheConfig } from '../types/business';
import { Product, ProductLot } from '../types/inventory';
import { Customer, PetPatient, AgroPrescriptionRetention } from '../types/customer';
import { RestaurantTable, KitchenTicket, Sale } from '../types/pos';
import { AppUser } from '../types/user';
import { NICHE_CONFIGS } from '../config/nicheConfigs';
import {
  INITIAL_PRODUCTS,
  INITIAL_LOTS,
  INITIAL_CUSTOMERS,
  INITIAL_PETS,
  INITIAL_AGRO_PRESCRIPTIONS,
  INITIAL_TABLES,
  INITIAL_KDS_TICKETS,
  INITIAL_SALES,
  INITIAL_USERS
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_NICHE: 'echpro_current_niche',
  CUSTOM_NICHE_CONFIGS: 'echpro_custom_niche_configs',
  PRODUCTS: 'echpro_products',
  LOTS: 'echpro_lots',
  CUSTOMERS: 'echpro_customers',
  PETS: 'echpro_pets',
  AGRO_PRESCRIPTIONS: 'echpro_agro_prescriptions',
  TABLES: 'echpro_tables',
  KDS: 'echpro_kds',
  SALES: 'echpro_sales',
  USERS: 'echpro_users',
  CURRENT_USER: 'echpro_current_user',
};

export const StorageService = {
  getCurrentNiche(): BusinessNiche {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_NICHE);
    return (saved as BusinessNiche) || 'retail';
  },

  setCurrentNiche(niche: BusinessNiche): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_NICHE, niche);
  },

  getNicheConfigs(): Record<BusinessNiche, BusinessNicheConfig> {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_NICHE_CONFIGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse custom niche configs:', e);
      }
    }
    return NICHE_CONFIGS;
  },

  saveNicheConfigs(configs: Record<BusinessNiche, BusinessNicheConfig>): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_NICHE_CONFIGS, JSON.stringify(configs));
  },

  getProducts(): Product[] {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getLots(): ProductLot[] {
    const saved = localStorage.getItem(STORAGE_KEYS.LOTS);
    return saved ? JSON.parse(saved) : INITIAL_LOTS;
  },

  saveLots(lots: ProductLot[]): void {
    localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(lots));
  },

  getCustomers(): Customer[] {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  },

  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  getPets(): PetPatient[] {
    const saved = localStorage.getItem(STORAGE_KEYS.PETS);
    return saved ? JSON.parse(saved) : INITIAL_PETS;
  },

  savePets(pets: PetPatient[]): void {
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
  },

  getAgroPrescriptions(): AgroPrescriptionRetention[] {
    const saved = localStorage.getItem(STORAGE_KEYS.AGRO_PRESCRIPTIONS);
    return saved ? JSON.parse(saved) : INITIAL_AGRO_PRESCRIPTIONS;
  },

  saveAgroPrescriptions(prescriptions: AgroPrescriptionRetention[]): void {
    localStorage.setItem(STORAGE_KEYS.AGRO_PRESCRIPTIONS, JSON.stringify(prescriptions));
  },

  getTables(): RestaurantTable[] {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  },

  saveTables(tables: RestaurantTable[]): void {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  },

  getKDSTickets(): KitchenTicket[] {
    const saved = localStorage.getItem(STORAGE_KEYS.KDS);
    return saved ? JSON.parse(saved) : INITIAL_KDS_TICKETS;
  },

  saveKDSTickets(tickets: KitchenTicket[]): void {
    localStorage.setItem(STORAGE_KEYS.KDS, JSON.stringify(tickets));
  },

  getSales(): Sale[] {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!saved) return INITIAL_SALES;
    try {
      const parsed: Sale[] = JSON.parse(saved);
      if (parsed.length < 5) {
        // Merge with initial rich seed data so charts are immediately populated
        const existingIds = new Set(parsed.map((s) => s.id));
        const merged = [...parsed, ...INITIAL_SALES.filter((s) => !existingIds.has(s.id))];
        return merged;
      }
      return parsed;
    } catch {
      return INITIAL_SALES;
    }
  },

  saveSales(sales: Sale[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  getUsers(): AppUser[] {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!saved) return INITIAL_USERS;
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: AppUser[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): AppUser {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS[0]; // Admin by default
  },

  setCurrentUser(user: AppUser): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_NICHE);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_NICHE_CONFIGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.LOTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.PETS);
    localStorage.removeItem(STORAGE_KEYS.AGRO_PRESCRIPTIONS);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.KDS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

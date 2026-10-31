/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, ActiveTab } from './components/layout/Navigation';
import { POSScreen } from './components/pos/POSScreen';
import { StockManagement } from './components/inventory/StockManagement';
import { CustomerManagement } from './components/customers/CustomerManagement';
import { TablesMap } from './components/restaurant/TablesMap';
import { KDSScreen } from './components/restaurant/KDSScreen';
import { NicheConfigurator } from './components/config/NicheConfigurator';
import { ArchitectureViewer } from './components/architecture/ArchitectureViewer';

import { BusinessNiche, BusinessNicheConfig, BusinessFeatureFlags } from './types/business';
import { Product, ProductLot } from './types/inventory';
import { Customer, PetPatient, AgroPrescriptionRetention } from './types/customer';
import { RestaurantTable, KitchenTicket, Sale, CartItem } from './types/pos';
import { StorageService } from './services/storageService';
import { NICHE_CONFIGS } from './config/nicheConfigs';

export default function App() {
  // 1. Core State loaded from StorageService
  const [currentNiche, setCurrentNiche] = useState<BusinessNiche>(() => StorageService.getCurrentNiche());
  const [nicheConfigs, setNicheConfigs] = useState<Record<BusinessNiche, BusinessNicheConfig>>(() =>
    StorageService.getNicheConfigs()
  );
  
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [lots, setLots] = useState<ProductLot[]>(() => StorageService.getLots());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [pets, setPets] = useState<PetPatient[]>(() => StorageService.getPets());
  const [tables, setTables] = useState<RestaurantTable[]>(() => StorageService.getTables());
  const [kdsTickets, setKdsTickets] = useState<KitchenTicket[]>(() => StorageService.getKDSTickets());
  const [agroPrescriptions, setAgroPrescriptions] = useState<AgroPrescriptionRetention[]>(() =>
    StorageService.getAgroPrescriptions()
  );
  const [sales, setSales] = useState<Sale[]>(() => StorageService.getSales());

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');

  const activeConfig = nicheConfigs[currentNiche];

  // 3. Persist State Changes
  useEffect(() => {
    StorageService.setCurrentNiche(currentNiche);
  }, [currentNiche]);

  useEffect(() => {
    StorageService.saveNicheConfigs(nicheConfigs);
  }, [nicheConfigs]);

  useEffect(() => {
    StorageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    StorageService.saveLots(lots);
  }, [lots]);

  useEffect(() => {
    StorageService.saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    StorageService.savePets(pets);
  }, [pets]);

  useEffect(() => {
    StorageService.saveTables(tables);
  }, [tables]);

  useEffect(() => {
    StorageService.saveKDSTickets(kdsTickets);
  }, [kdsTickets]);

  useEffect(() => {
    StorageService.saveSales(sales);
  }, [sales]);

  // Handler: Switch Niche
  const handleSelectNiche = (niche: BusinessNiche) => {
    setCurrentNiche(niche);
    // If switching to or from restaurant, make sure active tab is appropriate
    if (activeTab === 'tables' || activeTab === 'kds') {
      if (!nicheConfigs[niche].flags.enableTablesAndOrders) {
        setActiveTab('pos');
      }
    }
  };

  // Handler: Update Feature Flags dynamically for current niche
  const handleUpdateFlags = (partialFlags: Partial<BusinessFeatureFlags>) => {
    const updated = {
      ...nicheConfigs,
      [currentNiche]: {
        ...nicheConfigs[currentNiche],
        flags: {
          ...nicheConfigs[currentNiche].flags,
          ...partialFlags,
        },
      },
    };
    setNicheConfigs(updated);
  };

  // Handler: Reset current niche flags to default
  const handleResetNicheToDefaults = () => {
    const updated = {
      ...nicheConfigs,
      [currentNiche]: {
        ...NICHE_CONFIGS[currentNiche],
      },
    };
    setNicheConfigs(updated);
  };

  // Handler: Reset all data to factory demo defaults
  const handleResetAllData = () => {
    if (window.confirm('Deseja realmente restaurar todos os dados e configurações para o estado original de demonstração?')) {
      StorageService.resetAllData();
      window.location.reload();
    }
  };

  // Handler: When a sale is completed in POS
  const handleSaleCompleted = (sale: Sale, updatedProductsStock: { productId: string; newStock: number }[]) => {
    // 1. Record sale
    setSales((prev) => [sale, ...prev]);

    // 2. Abate stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        // Check items sold of this product
        const soldQty = sale.items
          .filter((i) => i.productId === prod.id)
          .reduce((sum, i) => sum + i.quantity, 0);

        if (soldQty > 0) {
          return {
            ...prod,
            currentStock: Math.max(0, prod.currentStock - soldQty),
          };
        }
        return prod;
      })
    );

    // 3. Abate stock from specific lots if used
    setLots((prev) =>
      prev.map((lot) => {
        const soldLotQty = sale.items
          .filter((i) => i.lotId === lot.id)
          .reduce((sum, i) => sum + i.quantity, 0);

        if (soldLotQty > 0) {
          return {
            ...lot,
            currentQuantity: Math.max(0, lot.currentQuantity - soldLotQty),
          };
        }
        return lot;
      })
    );

    // 4. Update customer balance if Fiado was used
    if (sale.debtAmountAdded > 0 && sale.customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === sale.customerId) {
            return {
              ...c,
              currentBalance: c.currentBalance + sale.debtAmountAdded,
              loyaltyPoints: c.loyaltyPoints + Math.floor(sale.totalLiquido / 10),
            };
          }
          return c;
        })
      );
    } else if (sale.customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === sale.customerId) {
            return {
              ...c,
              loyaltyPoints: c.loyaltyPoints + Math.floor(sale.totalLiquido / 10),
            };
          }
          return c;
        })
      );
    }

    // 5. If sale was tied to a restaurant table, free or update table
    if (sale.tableNumber) {
      setTables((prev) =>
        prev.map((tbl) => {
          if (tbl.tableNumber === sale.tableNumber) {
            return {
              ...tbl,
              status: 'LIVRE',
              activeComandaNumber: undefined,
              items: [],
            };
          }
          return tbl;
        })
      );
    }
  };

  // Handler: Stock adjustment from inventory screen
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, currentStock: newStock } : p))
    );
  };

  // Handler: Customer settlement of fiado debt
  const handleSettleCustomerDebt = (
    customerId: string,
    amountPaid: number,
    paymentMethod: 'Dinheiro' | 'Cartao' | 'Transferencia' | 'PIX'
  ) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            currentBalance: Math.max(0, c.currentBalance - amountPaid),
          };
        }
        return c;
      })
    );
  };

  // Handler: Update customer profile or credit limit
  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Handler: Send cart items directly to KDS
  const handleSendCartToKDS = (tableId?: string, items?: CartItem[]) => {
    if (!items || items.length === 0) return;

    const matchedTable = tableId ? tables.find((t) => t.id === tableId) : null;
    const ticketId = 'kds-' + Date.now();
    const orderNumber = `PED-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: KitchenTicket = {
      id: ticketId,
      saleOrTableId: tableId || 'counter',
      tableNumber: matchedTable?.tableNumber || 'Balcão',
      orderNumber,
      openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'NOVO',
      station: items[0]?.kitchenStation || 'Cozinha',
      urgency: 'NORMAL',
      items: items.map((i) => ({
        name: `${i.quantity}x ${i.name}`,
        quantity: i.quantity,
        notes: i.kitchenNotes,
        completed: false,
      })),
    };

    setKdsTickets((prev) => [newTicket, ...prev]);

    // If table was selected, assign items to table
    if (tableId) {
      setTables((prev) =>
        prev.map((t) => {
          if (t.id === tableId) {
            return {
              ...t,
              status: 'OCUPADA',
              activeComandaNumber: t.activeComandaNumber || `CMD-${Math.floor(100 + Math.random() * 900)}`,
              items: [...t.items, ...items],
            };
          }
          return t;
        })
      );
    }
  };

  // Handler: KDS ticket state progression
  const handleUpdateTicketStatus = (ticketId: string, status: KitchenTicket['status']) => {
    setKdsTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  // Handler: KDS ticket checklist item
  const handleToggleKdsItem = (ticketId: string, itemIdx: number) => {
    setKdsTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedItems = [...t.items];
          updatedItems[itemIdx] = {
            ...updatedItems[itemIdx],
            completed: !updatedItems[itemIdx].completed,
          };
          return { ...t, items: updatedItems };
        }
        return t;
      })
    );
  };

  // Handler: Table actions
  const handleUpdateTableStatus = (tableId: string, status: RestaurantTable['status']) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status } : t)));
  };

  const handleReleaseTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: 'LIVRE', items: [], activeComandaNumber: undefined } : t))
    );
  };

  const handleSelectTableForPOS = (table: RestaurantTable) => {
    setActiveTab('pos');
  };

  // Badge calculations
  const lowStockCount = products.filter((p) => p.currentStock <= p.minimumStock).length;
  const activeTablesCount = tables.filter((t) => t.status === 'OCUPADA' || t.status === 'CONTA_SOLICITADA').length;
  const kdsTicketsCount = kdsTickets.filter((t) => t.status === 'NOVO' || t.status === 'EM_PREPARO').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. Universal Top Header with Niche Switcher & Quick Stats */}
      <Header
        currentNiche={currentNiche}
        nicheConfigs={nicheConfigs}
        onSelectNiche={handleSelectNiche}
        onOpenArchitecture={() => setActiveTab('architecture')}
        onOpenConfig={() => setActiveTab('config')}
        onResetData={handleResetAllData}
      />

      {/* 2. Primary Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        config={activeConfig}
        cartCount={0}
        lowStockCount={lowStockCount}
        activeTablesCount={activeTablesCount}
        kdsTicketsCount={kdsTicketsCount}
      />

      {/* 3. Dynamic Screen Rendering based on Active Tab */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'pos' && (
          <POSScreen
            products={products}
            lots={lots}
            customers={customers}
            pets={pets}
            tables={tables}
            agroPrescriptions={agroPrescriptions}
            config={activeConfig}
            onSaleCompleted={handleSaleCompleted}
            onSendCartToKDS={handleSendCartToKDS}
          />
        )}

        {activeTab === 'stock' && (
          <StockManagement
            products={products}
            lots={lots}
            config={activeConfig}
            onUpdateProductStock={handleUpdateProductStock}
            onAddProduct={(p) => setProducts((prev) => [p, ...prev])}
            onAddLot={(l) => setLots((prev) => [l, ...prev])}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerManagement
            customers={customers}
            pets={pets}
            sales={sales}
            config={activeConfig}
            onUpdateCustomer={handleUpdateCustomer}
            onSettleDebt={handleSettleCustomerDebt}
            onAddCustomer={(c) => setCustomers((prev) => [c, ...prev])}
          />
        )}

        {activeTab === 'tables' && (
          <TablesMap
            tables={tables}
            config={activeConfig}
            onSelectTableForPOS={handleSelectTableForPOS}
            onUpdateTableStatus={handleUpdateTableStatus}
            onReleaseTable={handleReleaseTable}
          />
        )}

        {activeTab === 'kds' && (
          <KDSScreen
            tickets={kdsTickets}
            config={activeConfig}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onToggleItemDone={handleToggleKdsItem}
          />
        )}

        {activeTab === 'config' && (
          <NicheConfigurator
            currentNiche={currentNiche}
            nicheConfigs={nicheConfigs}
            onSelectNiche={handleSelectNiche}
            onUpdateFlags={handleUpdateFlags}
            onResetNicheToDefaults={handleResetNicheToDefaults}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureViewer />}
      </main>
    </div>
  );
}

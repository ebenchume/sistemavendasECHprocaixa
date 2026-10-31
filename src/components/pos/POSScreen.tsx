import React, { useState } from 'react';
import { ProductCatalog } from './ProductCatalog';
import { CartPanel } from './CartPanel';
import { CheckoutModal } from './CheckoutModal';
import { ReceiptModal } from './ReceiptModal';
import { QuickKioskBar } from './QuickKioskBar';
import { Product, ProductLot, ProductVariant, UnitOfMeasure } from '../../types/inventory';
import { CartItem, PaymentEntry, RestaurantTable, Sale } from '../../types/pos';
import { Customer, PetPatient, AgroPrescriptionRetention } from '../../types/customer';
import { BusinessNicheConfig } from '../../types/business';
import { POSEngine, CalculationResult } from '../../services/posEngine';

interface POSScreenProps {
  products: Product[];
  lots: ProductLot[];
  customers: Customer[];
  pets: PetPatient[];
  tables: RestaurantTable[];
  agroPrescriptions: AgroPrescriptionRetention[];
  config: BusinessNicheConfig;
  onSaleCompleted: (sale: Sale, updatedProducts: { productId: string; newStock: number }[]) => void;
  onSendCartToKDS?: (tableId?: string, items?: CartItem[]) => void;
}

export const POSScreen: React.FC<POSScreenProps> = ({
  products,
  lots,
  customers,
  pets,
  tables,
  agroPrescriptions,
  config,
  onSaleCompleted,
  onSendCartToKDS,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedPet, setSelectedPet] = useState<PetPatient | null>(null);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [selectedAgroPrescription, setSelectedAgroPrescription] = useState<AgroPrescriptionRetention | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Compute live cart totals
  const calculation: CalculationResult = POSEngine.calculateTotals(cart, config);

  const handleAddToCart = (
    product: Product,
    quantity: number,
    options?: {
      variant?: ProductVariant;
      lot?: ProductLot;
      customUnit?: UnitOfMeasure;
      notes?: string;
    }
  ) => {
    // Generate unique line item key
    const lineId = 'item-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5);
    
    // Price adjustments
    let unitPrice = product.salePrice;
    if (options?.variant?.priceModifier) {
      unitPrice += options.variant.priceModifier;
    }

    const unit = options?.customUnit || product.baseUnit;
    const total = Math.round(unitPrice * quantity * 100) / 100;

    const newItem: CartItem = {
      id: lineId,
      productId: product.id,
      code: options?.variant ? options.variant.sku : product.code,
      name: product.name,
      unit,
      quantity,
      unitPrice,
      costPrice: product.costPrice,
      discount: 0,
      taxPercent: product.taxPercent,
      total,
      
      variantId: options?.variant?.id,
      variantLabel: options?.variant?.name,
      lotId: options?.lot?.id,
      lotNumber: options?.lot?.lotNumber,
      expiryDate: options?.lot?.expirationDate,
      
      petId: selectedPet?.id,
      petName: selectedPet?.name,
      petWeightKg: selectedPet?.weightKg,
      
      isAgrochemical: product.nicheSpecific?.isAgrochemical,
      agroPrescriptionNumber: selectedAgroPrescription?.prescriptionNumber,
      
      kitchenStation: product.nicheSpecific?.kitchenStation,
      kitchenNotes: options?.notes,
      kitchenStatus: 'Pendente',
    };

    // If item with exact same product, variant, lot, unit already exists: increment quantity
    const existingIndex = cart.findIndex(
      (i) =>
        i.productId === newItem.productId &&
        i.variantId === newItem.variantId &&
        i.lotId === newItem.lotId &&
        i.unit === newItem.unit &&
        !i.kitchenNotes
    );

    if (existingIndex >= 0) {
      const updated = [...cart];
      const ex = updated[existingIndex];
      const newQty = ex.quantity + quantity;
      updated[existingIndex] = {
        ...ex,
        quantity: newQty,
        total: Math.round(ex.unitPrice * newQty * 100) / 100,
      };
      setCart(updated);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const handleUpdateQuantity = (lineId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === lineId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            total: Math.round(item.unitPrice * newQty * 100) / 100,
          };
        }
        return item;
      })
      .filter((i): i is CartItem => i !== null);

    setCart(updated);
  };

  const handleRemoveItem = (lineId: string) => {
    setCart(cart.filter((i) => i.id !== lineId));
  };

  const handleClearCart = () => {
    setCart([]);
    setSelectedPet(null);
    setSelectedAgroPrescription(null);
  };

  // Quick 2-click express sale for Kiosks/Bancas
  const handleQuickExpressSale = (product: Product) => {
    const lineItem: CartItem = {
      id: 'express-' + Date.now(),
      productId: product.id,
      code: product.code,
      name: product.name,
      unit: product.baseUnit,
      quantity: 1,
      unitPrice: product.salePrice,
      costPrice: product.costPrice,
      discount: 0,
      taxPercent: product.taxPercent,
      total: product.salePrice,
    };

    const calc = POSEngine.calculateTotals([lineItem], config);
    const payments: PaymentEntry[] = [{ method: 'Dinheiro', amount: calc.totalLiquido }];

    const result = POSEngine.processSaleCompletion(
      [lineItem],
      calc,
      payments,
      config,
      null,
      'Operador Caixa Rápido',
      undefined,
      undefined,
      'Venda Expressa Quiosque (1-Clique)'
    );

    onSaleCompleted(result.sale, result.updatedProductsStock);
    setCompletedSale(result.sale);
  };

  const handleFinalizeSale = (payments: PaymentEntry[], notes?: string) => {
    const result = POSEngine.processSaleCompletion(
      cart,
      calculation,
      payments,
      config,
      selectedCustomer,
      'Operador Caixa 01',
      selectedTable?.tableNumber,
      selectedTable?.activeComandaNumber,
      notes
    );

    onSaleCompleted(result.sale, result.updatedProductsStock);
    setCompletedSale(result.sale);
    setIsCheckoutOpen(false);
    handleClearCart();
  };

  const handleSendToKDS = () => {
    if (onSendCartToKDS && cart.length > 0) {
      onSendCartToKDS(selectedTable?.id, cart);
      alert('Pedido enviado com sucesso para a Cozinha (KDS)!');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] overflow-hidden">
      {/* 2-Click Quick Bar for Bancas & Quiosques */}
      {config.flags.enableTwoClickQuickSale && (
        <QuickKioskBar
          products={products}
          config={config}
          onQuickExpressSale={handleQuickExpressSale}
          onAddToCart={(p, q) => handleAddToCart(p, q)}
        />
      )}

      {/* Main Split Layout: Left = Product Catalog, Right = Cart & Checkout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Product Catalog */}
        <div className="flex-1 h-full overflow-hidden">
          <ProductCatalog
            products={products}
            lots={lots}
            config={config}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Right: Cart Panel */}
        <div className="w-full md:w-96 lg:w-[420px] h-full overflow-hidden">
          <CartPanel
            cart={cart}
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            pets={pets}
            selectedPet={selectedPet}
            onSelectPet={setSelectedPet}
            tables={tables}
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
            onSendToKDS={handleSendToKDS}
            agroPrescriptions={agroPrescriptions}
            selectedAgroPrescription={selectedAgroPrescription}
            onSelectAgroPrescription={setSelectedAgroPrescription}
            calculation={calculation}
            config={config}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          totalToPay={calculation.totalLiquido}
          customer={selectedCustomer}
          config={config}
          onConfirmSale={handleFinalizeSale}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {/* Receipt Modal */}
      {completedSale && (
        <ReceiptModal
          sale={completedSale}
          config={config}
          onNewSale={() => setCompletedSale(null)}
          onClose={() => setCompletedSale(null)}
        />
      )}
    </div>
  );
};

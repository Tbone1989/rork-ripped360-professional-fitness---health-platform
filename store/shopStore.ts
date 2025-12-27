import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem, Order, Address, PaymentMethod, ProductCategory } from '@/types/product';
import { fetchShopifyProducts } from '@/services/shopifyService';
import { products as fallbackProducts } from '@/mocks/products';

interface ShopState {
  // Products
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: ProductCategory | 'all';
  searchQuery: string;
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
  
  // Cart
  cartItems: CartItem[];
  cartTotal: number;
  
  // Orders
  orders: Order[];
  
  // User data
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  
  // Loading states
  isLoading: boolean;
  isLoadingProducts: boolean;
  productError: string | null;
  
  // Actions
  setCategory: (category: ProductCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest') => void;
  filterProducts: () => void;
  fetchProducts: () => Promise<void>;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateCartTotal: () => void;
  
  // Order actions
  createOrder: (shippingAddress: Address, billingAddress: Address, paymentMethod: PaymentMethod) => Promise<Order>;
  
  // Address actions
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Payment actions
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      // Initial state
      products,
      filteredProducts: products,
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'newest',
      cartItems: [],
      cartTotal: 0,
      orders: [],
      addresses: [],
      paymentMethods: [],
      isLoading: false,
      
      // Filter actions
      setCategory: (category) => {
        set({ selectedCategory: category });
        get().filterProducts();
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterProducts();
      },
      
      setSortBy: (sort) => {
        set({ sortBy: sort });
        get().filterProducts();
      },
      
      filterProducts: () => {
        const { products, selectedCategory, searchQuery, sortBy } = get();
        let filtered = [...products];
        
        // Filter by category
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(product => product.category === selectedCategory);
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        // Sort products
        switch (sortBy) {
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
        
        set({ filteredProducts: filtered });
      },
  fetchProducts: async () => {
    set({ isLoadingProducts: true, productError: null });
    try {
      const shopifyProducts = await fetchShopifyProducts(50);
      set({ 
        products: shopifyProducts.length > 0 ? shopifyProducts : fallbackProducts,
        filteredProducts: shopifyProducts.length > 0 ? shopifyProducts : fallbackProducts,
        isLoadingProducts: false 
      });
      get().filterProducts();
    } catch (error) {
      console.error('[Shop Store] Error fetching products:', error);
      set({ 
        products: fallbackProducts,
        filteredProducts: fallbackProducts,
        isLoadingProducts: false,
        productError: error instanceof Error ? error.message : 'Failed to fetch products'
      });
    }
  },

      
      // Cart actions
      addToCart: (product, quantity = 1, size, color) => {
        const { cartItems } = get();
        const existingItemIndex = cartItems.findIndex(
          item => item.productId === product.id && 
                 item.selectedSize === size && 
                 item.selectedColor === color
        );
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ cartItems: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            selectedSize: size,
            selectedColor: color,
            addedAt: new Date().toISOString(),
          };
          set({ cartItems: [...cartItems, newItem] });
        }
        
        get().calculateCartTotal();
      },
      
      removeFromCart: (itemId) => {
        const { cartItems } = get();
        set({ cartItems: cartItems.filter(item => item.id !== itemId) });
        get().calculateCartTotal();
      },
      
      updateCartItem: (itemId, quantity) => {
        const { cartItems } = get();
        const updatedItems = cartItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ cartItems: updatedItems });
        get().calculateCartTotal();
      },
      
      clearCart: () => {
        set({ cartItems: [], cartTotal: 0 });
      },
      
      calculateCartTotal: () => {
        const { cartItems } = get();
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        set({ cartTotal: total });
      },
      
      // Order actions
      createOrder: async (shippingAddress, billingAddress, paymentMethod) => {
        const { cartItems, cartTotal } = get();
        
        if (cartItems.length === 0) {
          throw new Error('Cart is empty');
        }
        
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const subtotal = cartTotal;
          const tax = subtotal * 0.08; // 8% tax
          const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
          const total = subtotal + tax + shipping;
          
          const order: Order = {
            id: `order-${Date.now()}`,
            userId: 'current-user',
            items: [...cartItems],
            subtotal,
            tax,
            shipping,
            total,
            status: 'pending',
            shippingAddress,
            billingAddress,
            paymentMethod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            trackingNumber: `RC${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
          
          const { orders } = get();
          set({ orders: [order, ...orders] });
          get().clearCart();
          
          set({ isLoading: false });
          return order;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      // Address actions
      addAddress: (address) => {
        const { addresses } = get();
        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
        };
        
        // If this is the first address, make it default
        if (addresses.length === 0) {
          newAddress.isDefault = true;
        }
        
        set({ addresses: [...addresses, newAddress] });
      },
      
      updateAddress: (id, addressUpdate) => {
        const { addresses } = get();
        const updatedAddresses = addresses.map(addr => 
          addr.id === id ? { ...addr, ...addressUpdate } : addr
        );
        set({ addresses: updatedAddresses });
      },
      
      deleteAddress: (id) => {
        const { addresses } = get();
        set({ addresses: addresses.filter(addr => addr.id !== id) });
      },
      
      setDefaultAddress: (id) => {
        const { addresses } = get();
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id,
        }));
        set({ addresses: updatedAddresses });
      },
      
      // Payment actions
      addPaymentMethod: (method) => {
        const { paymentMethods } = get();
        const newMethod: PaymentMethod = {
          ...method,
          id: `pm-${Date.now()}`,
        };
        
        // If this is the first payment method, make it default
        if (paymentMethods.length === 0) {
          newMethod.isDefault = true;
        }
        
        set({ paymentMethods: [...paymentMethods, newMethod] });
      },
      
      updatePaymentMethod: (id, methodUpdate) => {
        const { paymentMethods } = get();
        const updatedMethods = paymentMethods.map(method => 
          method.id === id ? { ...method, ...methodUpdate } : method
        );
        set({ paymentMethods: updatedMethods });
      },
      
      deletePaymentMethod: (id) => {
        const { paymentMethods } = get();
        set({ paymentMethods: paymentMethods.filter(method => method.id !== id) });
      },
      
      setDefaultPaymentMethod: (id) => {
        const { paymentMethods } = get();
        const updatedMethods = paymentMethods.map(method => ({
          ...method,
          isDefault: method.id === id,
        }));
        set({ paymentMethods: updatedMethods });
      },
    }),
    {
      name: 'shop-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        orders: state.orders,
        addresses: state.addresses,
        paymentMethods: state.paymentMethods,
      }),
    }
  )
);
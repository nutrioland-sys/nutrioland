"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CustomerProfile, OrderRecord, SavedAddress } from "./types";

interface AccountContextValue {
  profile: CustomerProfile;
  updateProfile: (profile: CustomerProfile) => void;
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, "id">) => SavedAddress;
  updateAddress: (id: string, patch: Partial<SavedAddress>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  orders: OrderRecord[];
  recordOrder: (order: OrderRecord) => void;
  isLoaded: boolean;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);
const STORAGE_KEY = "nutrioland-account";

const EMPTY_PROFILE: CustomerProfile = { name: "", phone: "", email: "" };

interface StoredAccount {
  profile: CustomerProfile;
  addresses: SavedAddress[];
  orders: OrderRecord[];
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(EMPTY_PROFILE);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredAccount = JSON.parse(stored);
        setProfile(parsed.profile ?? EMPTY_PROFILE);
        setAddresses(parsed.addresses ?? []);
        setOrders(parsed.orders ?? []);
      }
    } catch {
      // Corrupted or inaccessible storage — start fresh.
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const payload: StoredAccount = { profile, addresses, orders };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [profile, addresses, orders, isLoaded]);

  function updateProfile(next: CustomerProfile) {
    setProfile(next);
  }

  function addAddress(address: Omit<SavedAddress, "id">) {
    const newAddress: SavedAddress = { ...address, id: `addr-${Date.now()}` };
    setAddresses((current) => {
      const shouldBeDefault = current.length === 0 || newAddress.isDefault;
      const withFlag = { ...newAddress, isDefault: shouldBeDefault };
      const updated = shouldBeDefault
        ? current.map((a) => ({ ...a, isDefault: false }))
        : current;
      return [...updated, withFlag];
    });
    return newAddress;
  }

  function updateAddress(id: string, patch: Partial<SavedAddress>) {
    setAddresses((current) => current.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function removeAddress(id: string) {
    setAddresses((current) => current.filter((a) => a.id !== id));
  }

  function setDefaultAddress(id: string) {
    setAddresses((current) => current.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  // The order itself (id/createdAt included) is created server-side via
  // POST /api/orders so admin has a shared record of it; this just mirrors
  // that same order into this customer's own local "My Account" history.
  function recordOrder(order: OrderRecord) {
    setOrders((current) => [order, ...current]);
  }

  return (
    <AccountContext.Provider
      value={{
        profile,
        updateProfile,
        addresses,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        orders,
        recordOrder,
        isLoaded,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

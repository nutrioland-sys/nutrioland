"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { OrderRecord, PublicCustomerAccount, SavedAddress } from "./types";

export interface SignupInput {
  name: string;
  phone: string;
  email?: string;
  password: string;
  address?: Omit<SavedAddress, "id">;
}

interface AccountContextValue {
  customer: PublicCustomerAccount | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  login: (phone: string, password: string) => Promise<{ error?: string }>;
  signup: (input: SignupInput) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (patch: { name?: string; email?: string }) => Promise<{ error?: string }>;
  addAddress: (address: Omit<SavedAddress, "id">) => Promise<{ error?: string }>;
  updateAddress: (id: string, patch: Partial<SavedAddress>) => Promise<{ error?: string }>;
  removeAddress: (id: string) => Promise<{ error?: string }>;
  setDefaultAddress: (id: string) => Promise<{ error?: string }>;
  orders: OrderRecord[];
  refreshOrders: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

async function parseErrorResponse(response: Response): Promise<{ error?: string }> {
  if (response.ok) return {};
  try {
    const body = await response.json();
    return { error: body.error ?? "Something went wrong." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<PublicCustomerAccount | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshOrders = useCallback(async () => {
    const response = await fetch("/api/auth/orders");
    if (response.ok) {
      setOrders(await response.json());
    } else {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/auth/me");
      const body = await response.json();
      setCustomer(body.customer ?? null);
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (customer) {
      refreshOrders();
    } else {
      setOrders([]);
    }
  }, [customer, refreshOrders]);

  async function login(phone: string, password: string) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const result = await parseErrorResponse(response);
    if (!result.error) {
      const body = await response.json();
      setCustomer(body.customer);
    }
    return result;
  }

  async function signup(input: SignupInput) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await parseErrorResponse(response);
    if (!result.error) {
      const body = await response.json();
      setCustomer(body.customer);
    }
    return result;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
  }

  async function updateProfile(patch: { name?: string; email?: string }) {
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const result = await parseErrorResponse(response);
    if (!result.error) {
      const body = await response.json();
      setCustomer(body.customer);
    }
    return result;
  }

  async function addAddress(address: Omit<SavedAddress, "id">) {
    const response = await fetch("/api/auth/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    const result = await parseErrorResponse(response);
    if (!result.error) {
      const body = await response.json();
      setCustomer(body.customer);
    }
    return result;
  }

  async function updateAddress(id: string, patch: Partial<SavedAddress>) {
    const response = await fetch(`/api/auth/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const result = await parseErrorResponse(response);
    if (!result.error) {
      const body = await response.json();
      setCustomer(body.customer);
    }
    return result;
  }

  async function removeAddress(id: string) {
    const response = await fetch(`/api/auth/addresses/${id}`, { method: "DELETE" });
    const result = await parseErrorResponse(response);
    if (!result.error) {
      const body = await response.json();
      setCustomer(body.customer);
    }
    return result;
  }

  async function setDefaultAddress(id: string) {
    return updateAddress(id, { isDefault: true });
  }

  return (
    <AccountContext.Provider
      value={{
        customer,
        isLoggedIn: customer !== null,
        isLoaded,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        orders,
        refreshOrders,
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

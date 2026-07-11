import "server-only";
import type { CustomerAccount, PublicCustomerAccount, SavedAddress } from "@/lib/types";
import { readJsonStore, writeJsonStore } from "./json-store";
import { hashPassword } from "./password";

const FILE = "customer-accounts.json";

function normalizePhone(phone: string): string {
  return phone.trim();
}

export function toPublicCustomer(customer: CustomerAccount): PublicCustomerAccount {
  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...rest } = customer;
  return rest;
}

export async function getCustomerAccounts(): Promise<CustomerAccount[]> {
  return readJsonStore(FILE, [] as CustomerAccount[]);
}

async function saveCustomerAccounts(customers: CustomerAccount[]): Promise<void> {
  await writeJsonStore(FILE, customers);
}

export async function getCustomerAccountByPhone(phone: string): Promise<CustomerAccount | null> {
  const customers = await getCustomerAccounts();
  return customers.find((c) => c.phone === normalizePhone(phone)) ?? null;
}

export async function getCustomerAccountById(id: string): Promise<CustomerAccount | null> {
  const customers = await getCustomerAccounts();
  return customers.find((c) => c.id === id) ?? null;
}

export async function createCustomerAccount(input: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  addresses?: SavedAddress[];
}): Promise<CustomerAccount> {
  const customers = await getCustomerAccounts();
  const phone = normalizePhone(input.phone);

  if (customers.some((c) => c.phone === phone)) {
    throw new Error("An account with this phone number already exists.");
  }

  const { hash, salt } = hashPassword(input.password);
  const newCustomer: CustomerAccount = {
    id: `cus-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    phone,
    email: input.email || undefined,
    passwordHash: hash,
    passwordSalt: salt,
    addresses: input.addresses ?? [],
    createdAt: new Date().toISOString(),
  };
  customers.push(newCustomer);
  await saveCustomerAccounts(customers);
  return newCustomer;
}

export async function updateCustomerAccount(
  id: string,
  patch: Partial<Pick<CustomerAccount, "name" | "email" | "addresses">>
): Promise<CustomerAccount | null> {
  const customers = await getCustomerAccounts();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;
  customers[index] = { ...customers[index], ...patch, id: customers[index].id };
  await saveCustomerAccounts(customers);
  return customers[index];
}

export async function setCustomerPassword(id: string, newPassword: string): Promise<boolean> {
  const customers = await getCustomerAccounts();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return false;
  const { hash, salt } = hashPassword(newPassword);
  customers[index] = { ...customers[index], passwordHash: hash, passwordSalt: salt };
  await saveCustomerAccounts(customers);
  return true;
}

export async function addCustomerAddress(
  customerId: string,
  address: Omit<SavedAddress, "id">
): Promise<CustomerAccount | null> {
  const customers = await getCustomerAccounts();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return null;

  const newAddress: SavedAddress = { ...address, id: `addr-${Date.now()}` };
  const existing = customers[index].addresses;
  const shouldBeDefault = existing.length === 0 || newAddress.isDefault;
  const withFlag = { ...newAddress, isDefault: shouldBeDefault };
  const updated = shouldBeDefault ? existing.map((a) => ({ ...a, isDefault: false })) : existing;

  customers[index] = { ...customers[index], addresses: [...updated, withFlag] };
  await saveCustomerAccounts(customers);
  return customers[index];
}

export async function updateCustomerAddress(
  customerId: string,
  addressId: string,
  patch: Partial<Omit<SavedAddress, "id">>
): Promise<CustomerAccount | null> {
  const customers = await getCustomerAccounts();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return null;

  let addresses = customers[index].addresses.map((a) =>
    a.id === addressId ? { ...a, ...patch } : a
  );
  if (patch.isDefault) {
    addresses = addresses.map((a) => ({ ...a, isDefault: a.id === addressId }));
  }

  customers[index] = { ...customers[index], addresses };
  await saveCustomerAccounts(customers);
  return customers[index];
}

export async function removeCustomerAddress(
  customerId: string,
  addressId: string
): Promise<CustomerAccount | null> {
  const customers = await getCustomerAccounts();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return null;

  customers[index] = {
    ...customers[index],
    addresses: customers[index].addresses.filter((a) => a.id !== addressId),
  };
  await saveCustomerAccounts(customers);
  return customers[index];
}

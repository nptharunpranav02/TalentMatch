import React, { createContext, useContext, useMemo, useState } from "react";
import { getCurrentUser } from "../services/api";

const CURRENCIES = {
  USD: { code: "USD", symbol: "$", locale: "en-US", rate: 1, label: "USD ($) - Americas" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE", rate: 0.92, label: "EUR (€) - Europe" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", rate: 0.79, label: "GBP (£) - UK" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN", rate: 84, label: "INR (₹) - India" },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", rate: 152, label: "JPY (¥) - Japan" },
  CAD: { code: "CAD", symbol: "CA$", locale: "en-CA", rate: 1.38, label: "CAD ($) - Canada" },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU", rate: 1.52, label: "AUD ($) - Australia" },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG", rate: 1.34, label: "SGD ($) - Singapore" }
};

const OrgContext = createContext(null);

export function OrgProvider({ children }) {
  const currentUser = getCurrentUser();
  const orgName = currentUser?.company?.name || "Company workspace";
  const currencyStorageKey = `tm_currency_code:${currentUser?.company?.slug || "default"}`;
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(() => localStorage.getItem(currencyStorageKey) || "USD");
  const currency = CURRENCIES[selectedCurrencyCode] || CURRENCIES.USD;
  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setSelectedCurrencyCode(code);
      localStorage.setItem(currencyStorageKey, code);
    }
  };
  const formatMoney = (amount, options = {}) => {
    const converted = Number(amount || 0) * currency.rate;
    if (currency.code === "INR" && converted >= 100000 && options.compact) return `₹${(converted / 100000).toFixed(1)} Lakhs`;
    try {
      return new Intl.NumberFormat(currency.locale, { style: "currency", currency: currency.code, maximumFractionDigits: converted > 1000 ? 0 : 2, minimumFractionDigits: 0 }).format(converted);
    } catch {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
  };
  const value = useMemo(() => ({ orgName, currency, currencies: CURRENCIES, setCurrency, formatMoney }), [orgName, currency]);
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export const useOrg = () => useContext(OrgContext);

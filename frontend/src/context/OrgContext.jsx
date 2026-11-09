import React, { createContext, useContext, useState, useEffect } from "react";

const CURRENCIES = {
  USD: { code: "USD", symbol: "$", locale: "en-US", rate: 1.0, label: "USD ($) - Americas" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE", rate: 0.92, label: "EUR (€) - Europe" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", rate: 0.79, label: "GBP (£) - UK" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN", rate: 84.0, label: "INR (₹) - India" },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", rate: 152.0, label: "JPY (¥) - Japan" },
  CAD: { code: "CAD", symbol: "CA$", locale: "en-CA", rate: 1.38, label: "CAD ($) - Canada" },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU", rate: 1.52, label: "AUD ($) - Australia" },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG", rate: 1.34, label: "SGD ($) - Singapore" }
};

const OrgContext = createContext();

export function OrgProvider({ children }) {
  const [orgName, setOrgName] = useState(() => {
    return localStorage.getItem("tm_org_name") || "Global Enterprise Technologies";
  });

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(() => {
    return localStorage.getItem("tm_currency_code") || "USD";
  });

  const currency = CURRENCIES[selectedCurrencyCode] || CURRENCIES.USD;

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setSelectedCurrencyCode(code);
      localStorage.setItem("tm_currency_code", code);
    }
  };

  const updateOrgName = (name) => {
    setOrgName(name);
    localStorage.setItem("tm_org_name", name);
  };

  // Convert USD baseline amount to selected currency
  const formatMoney = (usdAmount, options = {}) => {
    const converted = usdAmount * currency.rate;
    
    // For INR, format nicely in Lakhs if large
    if (currency.code === "INR" && converted >= 100000 && options.compact) {
      return `₹${(converted / 100000).toFixed(1)} Lakhs`;
    }

    // Default locale currency formatting
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        maximumFractionDigits: converted > 1000 ? 0 : 2,
        minimumFractionDigits: 0
      }).format(converted);
    } catch {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
  };

  return (
    <OrgContext.Provider
      value={{
        orgName,
        updateOrgName,
        currency,
        currencies: CURRENCIES,
        setCurrency,
        formatMoney
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export const useOrg = () => useContext(OrgContext);

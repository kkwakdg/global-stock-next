"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { companyMatchesQuery, getCompanyDisplayName } from '../lib/companyNames';
import { fetchJsonWithTimeout } from '../lib/fetchJson';
import { CURRENCIES, formatMarketCap } from '../lib/formatters';
import {
  DEFAULT_LANGUAGE,
  TRANSLATIONS,
  detectBrowserLanguage,
  saveLanguagePreference,
  subscribeToLanguagePreference,
} from '../lib/i18n';

export default function useStockDashboard() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErrorKey, setLoadErrorKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const detectedLanguage = useSyncExternalStore(
    subscribeToLanguagePreference,
    detectBrowserLanguage,
    () => DEFAULT_LANGUAGE
  );
  const [currency, setCurrency] = useState(CURRENCIES.USD);

  const language = detectedLanguage || DEFAULT_LANGUAGE;
  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';
  const stockExchangeRates = stockData[0]?.exchangeRates;
  const exchangeRates = useMemo(
    () => stockExchangeRates || searchResult?.exchangeRates || {},
    [searchResult?.exchangeRates, stockExchangeRates]
  );

  const modalData = useMemo(() => {
    if (!searchResult) return null;

    return {
      name: getCompanyDisplayName(searchResult, language) || t.noData,
      ticker: searchResult.ticker || t.noData,
      price: searchResult.price || t.noData,
      chg: searchResult.chg || t.noData,
      marketCap: formatMarketCap(
        Number(searchResult.marketCapUsdTrillions),
        currency,
        searchResult.exchangeRates || exchangeRates,
        language
      ),
      isPositive: Boolean(searchResult.isPositive),
    };
  }, [currency, exchangeRates, language, searchResult, t.noData]);

  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (query.length < 1 || !Array.isArray(stockData)) return [];

    return stockData
      .filter((stock) => companyMatchesQuery(stock, query))
      .slice(0, 6)
      .map((stock) => ({
        ticker: stock.ticker,
        name: getCompanyDisplayName(stock, language),
        originalName: stock.name,
      }));
  }, [language, searchQuery, stockData]);

  useEffect(() => {
    let ignore = false;

    fetchJsonWithTimeout(`/api/stock?ts=${Date.now()}`)
      .then((data) => {
        if (ignore) return;
        setStockData(data);
        setLoadErrorKey('');
      })
      .catch((err) => {
        if (ignore) return;
        console.error('Stock data load error:', err);
        setLoadErrorKey(err.name === 'AbortError' ? 'timeout' : 'empty');
        setStockData([]);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const performSearch = useCallback(async (rawQuery) => {
    const query = rawQuery.trim();
    if (!query) return;

    setSearchLoading(true);
    try {
      const data = await fetchJsonWithTimeout(`/api/stock?search=${encodeURIComponent(query)}&ts=${Date.now()}`);
      setSearchResult(data);
      setSearchQuery('');
      setModalOpen(true);
    } catch (err) {
      alert(err.name === 'AbortError'
        ? t.searchTimeout
        : err.message || t.searchError
      );
    } finally {
      setSearchLoading(false);
    }
  }, [t.searchError, t.searchTimeout]);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    e.currentTarget.querySelector('input')?.blur();
    await performSearch(searchQuery);
  }, [performSearch, searchQuery]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  }, []);

  const handleLanguageChange = useCallback((nextLanguage) => {
    saveLanguagePreference(nextLanguage);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return {
    stockData,
    loading,
    loadErrorKey,
    searchQuery,
    searchLoading,
    searchSuggestions,
    modalOpen,
    modalData,
    isDark,
    language,
    currency,
    t,
    exchangeRates,
    setSearchQuery,
    setSelectedLanguage: handleLanguageChange,
    setCurrency,
    toggleTheme,
    handleSearch,
    performSearch,
    closeModal,
  };
}

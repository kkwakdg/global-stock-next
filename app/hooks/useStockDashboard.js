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

const CURRENCY_BY_LANGUAGE = {
  ko: CURRENCIES.KRW,
  en: CURRENCIES.USD,
  ja: CURRENCIES.JPY,
};

function normalizeSearchValue(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ');
}

function compactSearchValue(value) {
  return normalizeSearchValue(value).replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]/g, '');
}

function getSearchLabels(stock, language) {
  return [
    getCompanyDisplayName(stock, language),
    stock?.name,
    stock?.ticker,
  ].filter(Boolean);
}

function getBestSearchMatch(stock, query, language) {
  const normalizedQuery = normalizeSearchValue(query);
  const compactQuery = compactSearchValue(query);
  const labels = getSearchLabels(stock, language);
  const matches = labels
    .map((label) => {
      const normalizedLabel = normalizeSearchValue(label);
      const compactLabel = compactSearchValue(label);
      const normalizedIndex = normalizedLabel.indexOf(normalizedQuery);
      const compactIndex = compactLabel.indexOf(compactQuery);
      const startsWithQuery = normalizedLabel.startsWith(normalizedQuery) || compactLabel.startsWith(compactQuery);
      const startsAtWord = normalizedIndex === 0 || normalizedLabel.includes(` ${normalizedQuery}`);
      const matchIndex = normalizedIndex >= 0 ? normalizedIndex : compactIndex;

      if (matchIndex < 0) return null;

      return {
        label,
        score: [
          startsWithQuery ? 0 : 1,
          startsAtWord ? 0 : 1,
          matchIndex,
          Math.abs(compactLabel.length - compactQuery.length),
        ],
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      for (let index = 0; index < a.score.length; index += 1) {
        if (a.score[index] !== b.score[index]) {
          return a.score[index] - b.score[index];
        }
      }

      return a.label.localeCompare(b.label, language, {
        numeric: true,
        sensitivity: 'base',
      });
    });

  return matches[0] || { label: labels[0] || '', score: [1, 1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] };
}

function getMatchingTableStocks(stocks, query, language) {
  if (!Array.isArray(stocks)) return [];

  return stocks
    .filter((stock) => companyMatchesQuery(stock, query))
    .sort((a, b) => {
      const aMatch = getBestSearchMatch(a, query, language);
      const bMatch = getBestSearchMatch(b, query, language);

      for (let index = 0; index < aMatch.score.length; index += 1) {
        if (aMatch.score[index] !== bMatch.score[index]) {
          return aMatch.score[index] - bMatch.score[index];
        }
      }

      const labelSort = aMatch.label.localeCompare(bMatch.label, language, {
        numeric: true,
        sensitivity: 'base',
      });

      if (labelSort !== 0) return labelSort;

      return String(a.ticker || '').localeCompare(String(b.ticker || ''), 'en', {
        numeric: true,
        sensitivity: 'base',
      });
    });
}

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
  const [currencyOverride, setCurrencyOverride] = useState('');

  const language = detectedLanguage || DEFAULT_LANGUAGE;
  const currency = currencyOverride || CURRENCY_BY_LANGUAGE[language] || CURRENCIES.USD;
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

    return getMatchingTableStocks(stockData, query, language)
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

  useEffect(() => {
    if (!modalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  const performSearch = useCallback(async (rawQuery) => {
    const query = rawQuery.trim();
    if (!query) return;

    setSearchLoading(true);
    try {
      const [data] = getMatchingTableStocks(stockData, query, language);

      if (!data) {
        throw new Error(t.searchError);
      }

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
  }, [language, stockData, t.searchError, t.searchTimeout]);

  const openStockModal = useCallback((stock) => {
    if (!stock) return;

    setSearchResult(stock);
    setModalOpen(true);
  }, []);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    e.currentTarget.querySelector('input')?.blur();
    await performSearch(searchQuery);
  }, [performSearch, searchQuery]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  }, []);

  const handleLanguageChange = useCallback((nextLanguage) => {
    setCurrencyOverride(CURRENCY_BY_LANGUAGE[nextLanguage] || CURRENCIES.USD);
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
    setCurrency: setCurrencyOverride,
    toggleTheme,
    handleSearch,
    performSearch,
    openStockModal,
    closeModal,
  };
}

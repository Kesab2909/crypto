import { createContext, useState, useEffect } from "react";

// Create the context
export const CryptoContext = createContext();

// Create the provider component
export const CryptoContextProvider = (props) => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCurrency, setCurrentCurrency] = useState({
    name: "usd", // Changed from "USD" to "usd"
    symbol: "$",
  });

  const fetchCryptoData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-6ft4mo3VygFVj8pvXWc7rr4V' }
    };

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency.name}`,
        options
      );
      const data = await res.json();
      setCryptoList(data);
    } catch (err) {
      console.error("Failed to fetch crypto data:", err);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, [currentCurrency]);

  // REFILTER WHEN RAW LIST OR SEARCH TERM CHANGES
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCryptos(cryptoList);
    } else {
      setFilteredCryptos(
        cryptoList.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [cryptoList, searchTerm]);

  const contextValue = {
    cryptoList,          // List of all cryptocurrencies
    filteredCryptos,     // Filtered list based on search term
    currentCurrency,     // Currently selected currency
    setCurrentCurrency,  // Function to set current currency
    searchTerm,          // Current search term
    setSearchTerm,       // Function to update search term
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {props.children}
    </CryptoContext.Provider>
  );
};
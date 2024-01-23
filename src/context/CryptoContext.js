import { createContext, useLayoutEffect, useState } from "react";

export const CryptoContext = createContext({});

export const CryptoProvider = ({children}) => {
    const [cryptoData, setCryptoData] = useState();
    const [searchData, setSearchData] = useState();
    const [coinData, setCoinData] = useState();
    const [coinSearch, setCoinSearch] = useState("");

    const [currency, setCurrency] = useState("inr");
    const [sortBy, setSortBy] = useState("market_cap_desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(250);
    const [perPage, setPerPage] = useState(10);

    const getCryptoData = async () => {
        try {
            const data = await fetch(
                `https://api.coingecko.com/api/v3/coins/list`
            )
            .then(res => res.json())
            .then(json => json)
            //console.log(data);
            setTotalPages(data.length);
        } catch(error) {
            console.log(error);
        }

        try {
            const data = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinSearch}&order=${sortBy}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en`
            )
            .then(response => response.json())
            .then(json => json)
            console.log(data)
            setCryptoData(data);
        } catch(error) {
            console.log(error);
        }
    };

    const getCoinData = async (coinid) => {
        try {
            const data = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinid}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`
            )
            .then(res => res.json())
            .then(json => json);
            console.log("CoinData", data)
            setCoinData(data);
        } catch(error) {
            console.log(error);
        }
    };

    const getSearchResult = async (query) => {
        try {
            const data = await fetch(
                `https://api.coingecko.com/api/v3/search?query=${query}`
            )
            .then(res => res.json())
            .then(json => json);
            console.log(data);
            setSearchData(data.coins);
        } catch(error) {
            console.log(error);
        }
    };

    const resetFunction = () => {
        setPage(1);
        setCoinSearch("")
    }

    useLayoutEffect(() => {
        getCryptoData();      
    }, [coinSearch, currency, sortBy, page, perPage])

    return (
        <CryptoContext.Provider value={{cryptoData, searchData, getSearchResult, setCoinSearch, currency, setCurrency, sortBy, setSortBy, page, setPage, totalPages, resetFunction, setPerPage, perPage, getCoinData, coinData}}>{children}</CryptoContext.Provider>
    )
}
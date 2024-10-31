'use client'

import CircleLoader from "@/Components/circle-loader";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null)


export default function GlobalState({ children }) {

    const [loggedInAccount, setloggedInAccount] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [pageloader, setPageLoader] = useState(true)
    const [mediaData, setMediaData] = useState([]);
    const [searchResults, setSearchResults] = useState([])
    const [currenMediaInfoIdAndType, setCurrenMediaInfoIdAndType] = useState(null)
    const [showDetailsPopup, setShowDetailsPopup] = useState(false)
    const [mediaDetails, setMediaDetails] = useState(null)
    const [similarMedias, setSimilarMedias] = useState([])
    const [favorites, setFavorites] = useState([]);

    const { data: session } = useSession()

    useEffect(() => {
        setloggedInAccount(JSON.parse(sessionStorage.getItem('loggedInAccount')))
    }, [])

    if (session === undefined) return <CircleLoader />

    return <GlobalContext.Provider value={{
        loggedInAccount,
        setloggedInAccount,
        accounts,
        setAccounts,
        pageloader,
        setPageLoader,
        mediaData,
        setMediaData,
        searchResults,
        setSearchResults,
        favorites,
        setFavorites,
        currenMediaInfoIdAndType,
        setCurrenMediaInfoIdAndType,
        showDetailsPopup,
        setShowDetailsPopup,
        mediaDetails,
        setMediaDetails,
        similarMedias,
        setSimilarMedias
    }}
    >
        {children}
    </GlobalContext.Provider>
}
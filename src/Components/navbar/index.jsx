'use client'

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { AiOutlineSearch } from 'react-icons/ai'
import Search from "./search"
import { GlobalContext } from "@/context"
import AccountPopup from "./account-popup"
import CircleLoader from "../circle-loader"
import DetailsPopup from "../details-popup"




export default function Navbar() {
    // image 
    const imageUlr = `/netflix-logo.png`
    const profileImage = "https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4"

    const { data: session } = useSession()
    // States
    const [isScrolled, setIsScrolled] = useState(false)
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showAccountPopup, setShowAccountPopup] = useState(false)

    const { setPageLoader, loggedInAccount, setAccounts, accounts, setloggedInAccount, PageLoader, showDetailsPopup,
        setShowDetailsPopup } = useContext(GlobalContext)
    // Router
    const router = useRouter()
    const pathname = usePathname()

    const menuItem = [
        {
            id: 'home',
            title: 'Home',
            path: '/browse'
        },
        {
            id: 'tv',
            title: 'TV',
            path: '/tv'
        },
        {
            id: 'movies',
            title: 'Movies',
            path: '/movies'
        },
        {
            id: 'my-list',
            title: 'My-List',
            path: `/my-list/${session?.user?.uid}/${loggedInAccount._id}`
        }
    ]
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) setIsScrolled(true)
            else setIsScrolled(false)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    async function getAllAccounts() {
        const res = await fetch(
            `/api/account/get-all-accounts?id=${session?.user?.uid}`,
            {
                method: "GET",
            }
        );

        const data = await res.json();

        console.log(data);

        if (data && data.data && data.data.length) {
            setAccounts(data.data);
            setPageLoader(false);
        } else {
            setPageLoader(false);
        }
    }

    useEffect(() => {
        getAllAccounts()
    }, [])

    if (PageLoader) return <CircleLoader />

    return (
        <div className={'relative'}>
            <header className={`header ${isScrolled && 'bg-[#141414]'} hover:bg-[#141414]`}>
                <div className="flex items-center space-x-2 md:space-x-10">
                    <Image
                        src={imageUlr}
                        width={120}
                        height={120}
                        alt="NETFLIX"
                        className="cursor-pointer object-contain"
                        onClick={() => router.push("/browse")}
                    />
                    <ul className=" hidden md:space-x-4 md:flex cursor-pointer">
                        {
                            menuItem.map(item => (
                                <li
                                    onClick={() => {
                                        setPageLoader(true)
                                        router.push(item.path)
                                        setSearchQuery('')
                                        setShowSearchBar(false)
                                    }}
                                    key={item.id}
                                    className="cursor-pinter text-[16px] font-light text-[#e5e5e5] transition duration-[0.4s] hover:text-[#b3b3b3] "
                                >
                                    {item.title}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="font-light flex items-center space-x-4 text-sm">
                    {showSearchBar ? (
                        <Search
                            pathName={pathname}
                            router={router}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setPageLoader={setPageLoader}
                            setShowSearchBar={setShowSearchBar}
                        />
                    ) : (
                        <AiOutlineSearch
                            onClick={() => setShowSearchBar(true)}
                            className="hidden sm:inline sm:w-6 sm:h-6 cursor-pointer"
                        />
                    )}
                    <div
                        onClick={() => setShowAccountPopup(!showAccountPopup)}
                        className="flex gap-2 items-center cursor-pointer">
                        <Image
                            src={profileImage}
                            alt="Current Profile"
                            width={30}
                            height={30}
                            className="max-w-[30px] rounded min-w-[20px] max-h-[30px] min-h-[20px] object-cover w-[30px] h-[30px]"

                        />
                        <p>{loggedInAccount && loggedInAccount.name}</p>
                    </div>
                </div>
            </header>
            <DetailsPopup
                show={showDetailsPopup}
                settShow={setShowDetailsPopup}
            />
            {
                showAccountPopup && <AccountPopup accounts={accounts} setPageLoader={setPageLoader} signOut={signOut} loggedInAccount={loggedInAccount} setloggedInAccount={setloggedInAccount} />
            }
        </div>
    )
}
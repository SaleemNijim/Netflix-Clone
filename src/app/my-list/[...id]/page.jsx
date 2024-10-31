'use client'

import { GlobalContext } from "@/context"
import { motion } from "framer-motion"
import { getAllfavorites } from "@/utils"
import { useSession } from "next-auth/react"
import { useContext, useEffect } from "react"
import Navbar from "@/Components/navbar"
import MediaItem from "@/Components/media-item"
import CircleLoader from "@/Components/circle-loader"

export default function MyList() {


    const { favorites, setFavorites, loggedInAccount, pageloader, setPageLoader } = useContext(GlobalContext)
    const { data: session } = useSession()
    useEffect(() => {
        async function exctractFavorites() {
            const data = await getAllfavorites(session?.user?.uid, loggedInAccount._id)

            if (data) {
                setFavorites(data.map((item) => ({ ...item, addToFavorites: true })))
                setPageLoader(false)
            }
        }
        exctractFavorites()
    }, [loggedInAccount])

    if (pageloader) return <CircleLoader />
    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        viewport={{ once: true }}
    >
        <Navbar />
        <div className="mt-[100px] space-y-0.5 md:space-y-2 px-4">
            <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
                My List
            </h2>
            <div className="grid grid-col-5 gap-3 items-center scrollbar-hide md:p-2">
                {
                    favorites && favorites.length
                        ? favorites.map((searchItem) => <MediaItem key={searchItem.id} media={searchItem} listView={true} />)
                        : 'no favorites add'
                }
            </div>

        </div>

    </motion.div>
}
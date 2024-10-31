' use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { PlusIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/context";
import { useSession } from "next-auth/react";
import { getAllfavorites } from "@/utils";


export default function MediaItem({ serachView = false, media, similarMovieView = false, listView = false, title }) {

    const {
        currenMediaInfoIdAndType,
        loggedInAccount,
        setCurrenMediaInfoIdAndType,
        showDetailsPopup,
        setShowDetailsPopup,
        setFavorites,
        similarMedias,
        searchResults,
        setSearchResults,
        setSimilarMedias,
        mediaData,
        setMediaData } = useContext(GlobalContext)

    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter()
    const pathName = usePathname()
    const { data: session } = useSession()

    async function updateFavorites() {
        const res = await getAllfavorites(session?.user?.uid, loggedInAccount?._id)
        if (res) setFavorites(res.map(item => ({
            ...item,
            addToFavorites: true
        })))
    }


    async function handleAddToFavorites(item) {
        const {
            id,
            poster_path,
            backdrop_path,
            type } = item
        const res = await fetch(`/api/add-favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                backdrop_path,
                poster_path,
                movieID: id,
                accountID: loggedInAccount.id,
                type,
                uid: session?.user?.uid
            })
        })
        const data = await res.json()
        if (data && data.success) {
            if (pathName.includes('my-list')) updateFavorites()
            if (serachView) {

                let updatedSearchResults = [...searchResults]
                const indexOfCurrentAddedMedia = updatedSearchResults.findIndex(item => item.id === id)
                updatedSearchResults[indexOfCurrentAddedMedia] = {
                    ...updatedSearchResults[indexOfCurrentAddedMedia], addToFavorites: true
                }
                setSearchResults(updatedSearchResults)
            } else if (similarMovieView) {

                let updatedSimilarResults = [...similarMedias]
                const indexOfCurrentAddedMedia = updatedSimilarResults.findIndex(item => item.id === id)
                updatedSimilarResults[indexOfCurrentAddedMedia] = {
                    ...updatedSimilarResults[indexOfCurrentAddedMedia], addToFavorites: true
                }
                setSimilarMedias(updatedSimilarResults)
            } else {
                let updatedMediaData = [...mediaData]
                const findIndexOfRowItem = updatedMediaData.findIndex(item => item.title === title)
                let currentMovieAerryFromRowItem = updatedMediaData[findIndexOfRowItem].medias;
                const findIndexOfCurrentMovie = currentMovieAerryFromRowItem.findIndex(item => item.id === id)
                currentMovieAerryFromRowItem[findIndexOfCurrentMovie] = {
                    ...currentMovieAerryFromRowItem[findIndexOfCurrentMovie],
                    addToFavorites: true
                }
                setMediaData(updatedMediaData)



            }
        }
    }

    async function handleRemoveToFavorites(item) {
        const res = await fetch(`/api/favorites/remove-favorite?${item.id}`, {
            method: "DELETE"
        })
        const data = await res.json()
        if (data.success) updateFavorites()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}
        >
            <div className="relative cardWrapper h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[260px] transform duration-500 hover:scale-110  hover:z-[999]">
                <Image
                    src={`${baseUrl}/${media.backdrop_path || media.poster_path}`}
                    alt="media"
                    layout="fill"
                    className="rounded sm object-cover md:rounded hover:rounded-sm"
                    onClick={() => router.push(`/watch/${media?.type}/${listView ? media?.movieID : media?.id}`)}
                />

                <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
                    <button
                        onClick={media?.addToFavorites ? () => handleRemoveToFavorites(media) : handleAddToFavorites(media)}
                        className="{cursor-pointer border flex p-2 items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90 border-white   bg-black opacity-75 text-white}"
                    >
                        {media?.addToFavorites
                            ? listView ? <CheckIcon className="h-7 w-7" /> : null
                            : <PlusIcon className="h-7 w-7" />

                        }
                    </button>
                    <button
                        onClick={() => {
                            setShowDetailsPopup(true)
                            setCurrenMediaInfoIdAndType({
                                type: media?.type,
                                id: listView ? media.movieID : media?.id
                            })
                        }}
                        className={` ${media?.addToFavorites && !listView && "cursor-not-allowed"}cursor-pointer border flex p-2 items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90 border-white   bg-black opacity-75 text-black`}
                    >
                        <ChevronDownIcon className="h-7 w-7" color="#ffffff" />
                    </button>
                </div>
            </div>
        </motion.div>)
}
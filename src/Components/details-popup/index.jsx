'use client'

import { motion } from "framer-motion"
import MuiModel from '@mui/material/Modal'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "@/context";
import { getAllfavorites, getSimilarTVorMovies, getTVorMovieDetailsByID } from "@/utils";
import ReactPlayer from "react-player";
import MediaItem from "../media-item";
import { AiFillPlayCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DetailsPopup({ show, settShow, media }) {

    const {
        loggedInAccount,
        mediaDetails,
        setMediaDetails,
        similarMedias,
        setSimilarMedias,
        currenMediaInfoIdAndType,
        setCurrenMediaInfoIdAndType
    } = useContext(GlobalContext)

    const [key, setKey] = useState('')
    const router = useRouter()
    console.log(currenMediaInfoIdAndType);

    // Handle Close Fuction
    const handleClose = () => {
        settShow(false)
        setCurrenMediaInfoIdAndType(null)
    }

    useEffect(() => {
        if (currenMediaInfoIdAndType !== null) {
            async function getMediaDetail() {
                const extractMediaDetails = await getTVorMovieDetailsByID(currenMediaInfoIdAndType.type, currenMediaInfoIdAndType.id)
                const extractSimilarMovies = await getSimilarTVorMovies(currenMediaInfoIdAndType.type, currenMediaInfoIdAndType.id)



                const findIndexOfTrailer =
                    extractMediaDetails &&
                        extractMediaDetails.videos &&
                        extractMediaDetails.videos.results &&
                        extractMediaDetails.videos.results.length
                        ? extractMediaDetails.videos.results.findIndex(
                            (item) => item.type === "Trailer"
                        )
                        : -1;

                const findIndexOfClip =
                    extractMediaDetails &&
                        extractMediaDetails.videos &&
                        extractMediaDetails.videos.results &&
                        extractMediaDetails.videos.results.length
                        ? extractMediaDetails.videos.results.findIndex(
                            (item) => item.type === "Clip"
                        )
                        : -1;



                const allFavorites = await getAllfavorites(
                    session?.user?.uid,
                    loggedInAccount?._id
                );


                setMediaDetails(extractMediaDetails);
                console.log(mediaDetails, 'mediaDetails');
                setKey(
                    findIndexOfTrailer !== -1
                        ? extractMediaDetails.videos?.results[findIndexOfTrailer]?.key
                        : findIndexOfClip !== -1
                            ? extractMediaDetails.videos?.results[findIndexOfClip]?.key
                            : "XuDwndGaCFo"
                );

                setSimilarMedias(
                    extractSimilarMovies.map((item) => ({
                        ...item,
                        type: currenMediaInfoIdAndType.type === "movie" ? "movie" : "tv",
                        addedToFavorites:
                            allFavorites && allFavorites.length
                                ? allFavorites.map((fav) => fav.movieID).indexOf(item.id) >
                                -1
                                : false,
                    }))
                );

            }
            getMediaDetail()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currenMediaInfoIdAndType, loggedInAccount])

    console.log(key, 'key');
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
            <MuiModel
                open={show}
                onClose={handleClose}
                className="fixed !top-7 left-0 right-0 z-50 w-full mx-auto max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
            >
                <div>
                    <button
                        onClick={handleClose}
                        className="modalButton flex items-center justify-center absolute top-5 right-5 bg-[#181818] hover:bg-[#181818] !z-40 border-none h-9 w-9"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    <div className='relative pt-[56.25%]'>
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${key}`}
                            width={'100%'}
                            height={'100%'}
                            style={{ position: 'absolute', top: '0', left: '0' }}
                            playing
                            controls

                        />
                        <div className="absolute bottom-30 flex w-full items-center justify-between px-10">
                            <div>
                                <button
                                    className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black absolute right-6 top-7"
                                    onClick={() => router.push(`/watch/${currenMediaInfoIdAndType?.type}/${currenMediaInfoIdAndType?.id}`)}
                                >
                                    <AiFillPlayCircle className="h-4 w-4 text-black md:h-7 md:w-7 cursor-pointer" />
                                    Play
                                </button>
                            </div>
                        </div>
                    </div>
                    <div >
                        <div className="rouneded-b-md bg-[#181818] p-8">
                            <div className="space-x-2 pb-4 flex gap-4">
                                <div className="text-green-400 font-semibold flex gap-2">
                                    <span>
                                        {mediaDetails?.release_date
                                            ? mediaDetails?.release_date.split("-")[0]
                                            : "2023"}
                                    </span>
                                    <div className="inline-flex border-2 border-white/40 rounded px-2">
                                        HD
                                    </div>
                                </div>
                            </div>
                            <h2 className="mt-10 mb-6 cursor-pointer text-3xl font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
                                More Like This :
                            </h2>
                            <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2 ">
                                {similarMedias && similarMedias.length
                                    ? similarMedias
                                        .filter(
                                            (item) =>
                                                item.backdrop_path !== null && item.poster_path !== null
                                        )
                                        .map((mediaItem) => (
                                            <MediaItem
                                                key={mediaItem.id}
                                                media={mediaItem}
                                                similarMovieView={true}
                                            />
                                        ))
                                    : null}
                            </div>

                        </div>


                    </div>
                </div>

            </MuiModel>
        </motion.div >
    )
}
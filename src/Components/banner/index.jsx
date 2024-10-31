'use client'

import Image from "next/image";
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { AiFillPlayCircle } from 'react-icons/ai'
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/context";

export const Banner = ({ medias }) => {
    const { setMediaDetails } = useContext(GlobalContext)

    const createRandommedias = medias && medias.length
        ? medias[Math.floor(Math.random() * medias.length)]
        : null

    const baseUrl = 'https://image.tmdb.org/t/p/original';
    const router = useRouter()


    console.log(createRandommedias);
    return (
        <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pd-12 lg:pl-24">
            <div className="absolute top-0 left-0 h-[95vh] w-screen -z-10">
                <Image
                    src={`${baseUrl}/${createRandommedias?.backdrop_path || createRandommedias?.poster_path}`}
                    alt="banner"
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute w-full h-32 bg-gradient-to-t from-gray-500 to-transparent bottom-0 z-20" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-7xl font-bold text-white">{createRandommedias?.title || createRandommedias?.name || createRandommedias?.original}</h1>
            <p className="max-w-xs text-shadow-md text-sm md:max-w-lg md:text-lg lg:max-w-2xl line-clamp-5 font-semibold  ">{createRandommedias?.overview}</p>
            <div className=" flex space-x-3">
                <button
                    onClick={() => router.push(`/watch/${createRandommedias?.type}/${createRandommedias?.id}`)}
                    className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black hover:bg-[#dc2626] hover:text-white"
                >
                    <AiFillPlayCircle className="h-4 w-4 text-black md:h-7 md:w-7 cursor-pointer" />
                    Play
                </button>
                <button
                    onClick={() => setMediaDetails(true)}
                    className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-[gray]/70"
                >
                    <AiFillPlayCircle className="h-5 w-5 md:h-8 md:w-8 cursor-pointer" />
                    More Info
                </button>
            </div>
        </div>
    )
}

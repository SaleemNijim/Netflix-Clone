'use client'


import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context";
import { getTVorMovieVideosByID } from "@/utils";
import { useParams } from "next/navigation";
import CircleLoader from "@/Components/circle-loader";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";


export default function Watch() {

    const [mediaDetails, setMediaDetails] = useState(null);
    const [key, setKey] = useState(null);

    const { pageloader, setPageLoader } = useContext(GlobalContext);

    const params = useParams();

    useEffect(() => {
        async function getMediaDetails() {
            const extraMediaDetails = await getTVorMovieVideosByID(params.id[0], params.id[1]);

            if (extraMediaDetails) {
                const findIndexOfTrailer = extraMediaDetails.results?.findIndex(
                    (item) => item.type === 'Trailer'
                );

                const findIndexOfClip = extraMediaDetails.results?.findIndex(
                    (item) => item.type === 'Clip'
                );

                setMediaDetails(extraMediaDetails);
                setKey(findIndexOfTrailer !== -1 ? extraMediaDetails.results[findIndexOfTrailer]?.key : findIndexOfClip !== -1 ? extraMediaDetails.results[findIndexOfClip]?.key : 'XuDwndGaCFo');
            }
            setPageLoader(false)
        }

        getMediaDetails();
    }, [params]);


    if (pageloader) return <CircleLoader />


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}>
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${key}`}
                width={'100%'}
                height={'100%'}
                style={{ position: 'absolute', top: '0', left: '0' }}
                playing
                controls
            />
        </motion.div>
    );
}

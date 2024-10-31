'use client'

import Image from "next/image"

export default function AccountPopup({
    accounts,
    setloggedInAccount,
    signOut,
    loggedInAccount,
    setPageLoader
}) {

    const profileImage = "https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4"

    return (
        <div className="px-8 py-8 fixed top-[50px] gap-3 flex flex-col items-start right-[45px] bg-black opacity-[0.85] z-[999]">
            <div className="flex flex-col gap-3 ">
                {
                    accounts && accounts.length
                        ? accounts.filter(item => item._id !== loggedInAccount._id)
                            .map(account => (
                                <div
                                    onClick={() => { setloggedInAccount(null); sessionStorage.removeItem('loggedInAccount') }}
                                    key={account._id}
                                    className="cursor-pointer gap-5 flex ">
                                    <Image src={profileImage}
                                        width={30}
                                        height={30}
                                        alt='profileImage'
                                        className='max-w-[30px] rounded min-w-[20px] min-h-[20px] object-cover w-[30px] h-[30px]' />
                                    <p className="mb-4 ">{account.name}</p>
                                </div>
                            )
                            )
                        : null
                }
            </div>
            <div>
                <button
                    className="bg-[#e00611] text-white p-2 rounded-xl mt-3 hover:bg-black hover:text-[#e00611] text-sm"
                    onClick={() => {
                        setPageLoader(true)
                        signOut()
                        setloggedInAccount(null)
                        sessionStorage.removeItem('loggedInAccount')
                    }}>Sign out of Netflix</button>
            </div>
        </div>
    )
}
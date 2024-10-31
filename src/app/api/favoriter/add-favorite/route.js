import Favorites from "@/models/Favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        await connectToDB();

        const { uid, movieID, accountID } = await req.json();

        const isFavoriteAlreadyExists = await Favorites.find({ uid, movieID, accountID });
        console.log(isAccountAlreadyExists);
        if (isFavoriteAlreadyExists && isFavoriteAlreadyExists.length > 0) {
            return NextResponse.json({
                success: false,
                message: "This Already Add to your List",
            });
        }


        const newlyAddFavorite = await Favorites.create({
            uid, movieID, accountID
        });

        if (newlyAddFavorite) {
            return NextResponse.json({
                success: true,
                message: "Add ti your List successfully",
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Something Went wrong",
            });
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            success: false,
            message: "Something Went wrong",
        });
    }
}

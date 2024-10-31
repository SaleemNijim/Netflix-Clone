import connectToDB from "@/dataBase";
import Account from "@/models/Account";
import Favorites from "@/models/Favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const accountID = searchParams('accountID')

        const getAllFavorites = await Favorites.find({ uid: id, accountID });

        if (getAllFavorites) {
            return NextResponse.json({
                success: true,
                data: getAllAccounts,
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

import connectToDB from "@/dataBase";
import Favorites from "@/models/Favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Favorite item ID is requierd",
            });
        }

        const deleteFavoriteItem = await Favorites.findByIdAndDelete(id);

        if (deleteFavoriteItem) {
            return NextResponse.json({
                success: true,
                message: "Remove From Your list successfully",
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

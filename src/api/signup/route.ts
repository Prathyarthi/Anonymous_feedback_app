import dbConnect from "@/lib/dbConnect";


export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
    } catch (error) {
        console.error("Error signing up:", error);
        return Response.json({
            success: false,
            message: "Error signing up"
        }, {
            status: 500
        })
    }
}

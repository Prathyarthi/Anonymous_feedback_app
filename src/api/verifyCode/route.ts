import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const { username, code } = await req.json()

        const user = await UserModel.findOne({
            username,
            verifyCode: code
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        const isCodeValid = user.verifyCode === code

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        }
        else if (isCodeValid && !isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code expired"
            }, { status: 400 })
        }
        else {
            return Response.json({
                success: false,
                message: "Invalid code"
            }, { status: 400 })
        }
    } catch (error) {
        console.log(error);

        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}
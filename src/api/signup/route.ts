import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();

        const existingUserVerified = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerified) {
            return Response.json({
                success: false,
                message: "User already exists",
            }, {
                status: 400
            })
        }

        const userExistsByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(10000 + Math.random() + 90000).toString()

        if (userExistsByEmail) {
            if (userExistsByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists",
                }, {
                    status: 400
                })
            } else {
                userExistsByEmail.verifyCode = verifyCode
                userExistsByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                userExistsByEmail.isVerified = false
                await userExistsByEmail.save()
            }
        } else {
            const hashedPassword = bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const user = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: false,
                messages: []
            })
            await user.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail({
            username,
            email,
            otp: verifyCode
        })

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "Sign up successful, please verify your email"
        }, {
            status: 201
        })
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

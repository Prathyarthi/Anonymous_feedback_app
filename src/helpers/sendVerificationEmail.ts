import { resend } from "@/lib/resend";
import VerificationEmail from "@/components/verification_email_template";
import { ApiResponse } from "@/types/ApiResponse";

interface SendVerificationEmailProps {
    username: string
    email: string
    otp: string
}
export async function sendVerificationEmail({ username, email, otp }: SendVerificationEmailProps): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({ username, otp }),
        });
        return {
            success: true,
            message: "Verification email sent"
        }
    } catch (error) {
        console.log("Error sending verification email", error);
        return {
            success: false,
            message: "Error sending verification email"
        }
    }
}
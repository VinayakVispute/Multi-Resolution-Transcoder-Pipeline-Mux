import { SignUp } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6fcf5] to-white text-[#0ca678] p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-[#0ca678] hover:text-[#12b886] transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-[#0ca678] to-[#12b886] p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Sign Up</h1>
            <p className="text-[#e6fcf5] mt-2">Create your account to get started</p>
          </div>
          <div className="p-6 md:p-8">
            <SignUp

            />
          </div>
        </div>
      </div>
    </div>
  );
}
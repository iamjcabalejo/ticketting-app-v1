import Link from "next/link";
import { RegistrationForm } from "@/services/registration/component/registration-form";
import { Button } from "@/components/ui/button";

export default function Registration() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 text-sm sm:text-base"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div className="w-16 sm:w-24"></div> {/* Spacer for centering */}
        </div>
        
        {/* Registration form */}
        <div className="flex justify-center">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-sm sm:max-w-lg w-full mx-2 sm:mx-4">
            <RegistrationForm />
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-purple-400/50 rounded-full animate-bounce delay-500"></div>
      </div>
    </div>
  );
}
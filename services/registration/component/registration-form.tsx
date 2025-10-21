"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { submitRegistrationForm, RegistrationFormData } from "@/services/registration/data-access/form-actions/submit-registration";
import { QRCodeDisplay } from "@/lib/qr-generator/qr-generator";
import { QRCodeData } from "@/lib/qr-generator/server-qr-generator";

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");
    
    try {
      // Create FormData object for the server action
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);

      // Call the server action
      const result = await submitRegistrationForm(formData);
      
      if (result.success) {
        setSubmitMessage(result.message);
        if (result.registrationData) {
          setQrCodeData(result.registrationData);
        }
        setIsSubmitted(true);
        form.reset();
      } else {
        setSubmitError(result.message);
        
        // Set field errors if available
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, errors]) => {
            form.setError(field as keyof RegistrationFormData, {
              type: 'server',
              message: errors[0],
            });
          });
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-green-400">Registration Successful!</h2>
          <p className="text-white/70 text-sm sm:text-base lg:text-lg px-2">
            {submitMessage || "Thank you for registering. Your QR code has been generated and sent to your email."}
          </p>
        </div>
        
        {qrCodeData && (
          <div className="backdrop-blur-sm bg-white/5 border border-white/20 p-4 sm:p-6 rounded-2xl">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Your Event QR Code</h3>
            <div className="bg-white p-2 sm:p-4 rounded-xl inline-block">
              <QRCodeDisplay data={qrCodeData} size={160} />
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/80 space-y-1">
              <p><strong>Name:</strong> {qrCodeData.firstName} {qrCodeData.lastName}</p>
              <p><strong>Email:</strong> {qrCodeData.email}</p>
              <p><strong>Phone:</strong> {qrCodeData.phone}</p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => {
            setIsSubmitted(false);
            setSubmitMessage("");
            setSubmitError("");
            setQrCodeData(null);
            form.reset();
          }}
          className="w-full h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
        >
          Register Another Person
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Event Registration</h2>
        <p className="text-white/70 text-sm sm:text-base px-2">
          Please fill out the form below to register for the event.
        </p>
      </div>
      
      {submitError && (
        <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <p className="text-red-300 text-xs sm:text-sm">{submitError}</p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm sm:text-base">First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 backdrop-blur-sm h-10 sm:h-11 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm sm:text-base">Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Doe" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 backdrop-blur-sm h-10 sm:h-11 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90 text-sm sm:text-base">Email Address *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 backdrop-blur-sm h-10 sm:h-11 text-sm sm:text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-300 text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90 text-sm sm:text-base">Phone Number *</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 backdrop-blur-sm h-10 sm:h-11 text-sm sm:text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-300 text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Register for Event"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

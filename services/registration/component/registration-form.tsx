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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Registration Successful!</CardTitle>
          <CardDescription>
            {submitMessage || "Thank you for registering. Your QR code has been generated and sent to your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {qrCodeData && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Your Event QR Code</h3>
              <QRCodeDisplay data={qrCodeData} size={200} />
              <div className="mt-4 text-sm text-gray-600">
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
            variant="outline"
          >
            Register Another Person
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Event Registration</CardTitle>
        <CardDescription>
          Please fill out the form below to register for the event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register for Event"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

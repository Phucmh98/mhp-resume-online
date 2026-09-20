"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendMail } from "@/api/email";
import HorizontalLine from "./horizontal-line";

interface FormData {
  fullName: string;
  email: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!data.message.trim()) {
      newErrors.message = "Message is required.";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (hasSubmitted) {
      const fieldErrors = validate(updatedData);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof FormErrors],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendMail({
        name: formData.fullName,
        email: formData.email,
        message: formData.message,
      });

      if (result.success) {
        toast.success(
          "Your message has been sent! I will get back to you soon.",
        );
        setFormData({
          fullName: "",
          email: "",
          message: "",
        });
        setHasSubmitted(false);
        setErrors({});
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full flex-1 flex flex-col gap-4"
    >
      {/* Full Name */}
      <div className="w-full flex flex-col gap-1.5">
        <Label
          htmlFor="fullName"
          className="text-[13px] sm:text-sm text-zinc-600 dark:text-zinc-300"
        >
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="e.g. Name"
          value={formData.fullName}
          onChange={handleChange}
          aria-invalid={hasSubmitted && !!errors.fullName}
          disabled={isSubmitting}
          className="w-full h-10 px-3 text-[13px] sm:text-sm rounded"
        />
        {hasSubmitted && errors.fullName && (
          <p className="text-xs text-destructive mt-0.5 font-medium">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="w-full flex flex-col gap-1.5">
        <Label
          htmlFor="email"
          className="text-[13px] sm:text-sm text-zinc-600 dark:text-zinc-300"
        >
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="e.g. example@example.com"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={hasSubmitted && !!errors.email}
          disabled={isSubmitting}
          className="w-full h-10 px-3 text-[13px] sm:text-sm rounded"
        />
        {hasSubmitted && errors.email && (
          <p className="text-xs text-destructive mt-0.5 font-medium">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message Textarea */}
      <div className="w-full flex flex-col gap-1.5">
        <Label
          htmlFor="message"
          className="text-[13px] sm:text-sm text-zinc-600 dark:text-zinc-300"
        >
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project, idea, or just say hello..."
          rows={6}
          value={formData.message}
          onChange={handleChange}
          aria-invalid={hasSubmitted && !!errors.message}
          disabled={isSubmitting}
          className="w-full min-h-35 resize-y p-3 text-[13px] sm:text-sm rounded"
        />
        {hasSubmitted && errors.message && (
          <p className="text-xs text-destructive mt-0.5 font-medium">
            {errors.message}
          </p>
        )}
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 italic">
          Please do not spam email. Genuine inquiries only!
        </p>
      </div>

      {/* Submit Button */}
      <div className="-mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-auto">
        <HorizontalLine bleed />
        <div className="py-4 px-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer rounded-b-lg mt-0 z-20">
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative group block mt-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="absolute -inset-1.25 border border-black/5 dark:border-white/15 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/20" />
            <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/10 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </form>
  );
}

export default ContactForm;

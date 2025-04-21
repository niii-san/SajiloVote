"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

function Page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [resErr, setResErr] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (resErr) setResErr(null);
    try {
      await api.post("/api/v1/auth/login", {
        email_address: values.email,
        password: values.password,
      });
    } catch (error: any) {
      setResErr(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome Back</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      autoComplete="email"
                      className=""
                    />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        autoComplete="current-password"
                        className=""
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setIsPasswordVisible((p) => !p)}
                        aria-label={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                      >
                        {isPasswordVisible ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />

                  {resErr && (
                    <FormMessage className="text-red-500">{resErr}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center mt-4">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;

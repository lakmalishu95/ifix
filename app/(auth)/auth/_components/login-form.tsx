"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "../../schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormError } from "@/components/form-error";
import { useState, useTransition } from "react";
import { LoadingButton } from "@/components/ui/loading-button";

export const LoginForm = () => {
  const [error, setError] = useState("");
  const [passShow, setPassShow] = useState(false);

  const [loginTransition, startLoginTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handlerSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startLoginTransition(async () => {
      await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      }).then((res: any) => {
        if (res.url) {
          router.replace("/dashboard");
        }

        if (res.error) {
          setError("Email or Password is Incorrect");
        }
      });
    });
  };

  const router = useRouter();
  return (
    <Card className="min-w-[400px]">
      <CardContent>
        <CardHeader>
          <h1 className="text-[20px] font-bold">Login</h1>
          <Form {...form}>
            <form
              className="space-y-[20px]"
              onSubmit={form.handleSubmit(handlerSubmit)}
            >
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError visible={error ? true : false} error={error} />
              <LoadingButton className="w-full" loading={loginTransition}>Login</LoadingButton>
            </form>
          </Form>
        </CardHeader>
      </CardContent>
    </Card>
  );
};

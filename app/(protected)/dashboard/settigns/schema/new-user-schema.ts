import { z } from "zod";

export const NewUserSchema = z.object({
  email: z.string().email({
    message: "Email are required!",
  }),

  fname: z.string().min(1, {
    message: "First name are required!",
  }),
  lname: z.string().min(1, {
    message: "Last name are required!",
  }),
  password: z.string(),
});

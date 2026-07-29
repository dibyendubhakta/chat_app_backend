import z from "zod"

export const loginShema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20)
});


export const registerShema = z.object({
    name: z.string().min(3).max(30),
    phone: z.string().min(9).max(11),
    email: z.email(),
    password: z.string().min(6).max(20)
});
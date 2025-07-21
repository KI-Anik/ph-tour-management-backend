import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "name must be atleast 2 characters long" })
        .max(50, { message: "name cannot exceed 50 characters" }),
    email: z
        .string({ invalid_type_error: "email must be string" })
        .email({ message: "Invalid email format" })
        .min(5, { message: "email must be at least 5 character long" })
        .max(50, { message: "email cannot exceed 50 character" }),
    password: z
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "password must be at least 8 characters long" })
        .regex(/^(?=.*[A-Z])/, {
            message: "password must be at least 1 UPPER CASE letter"
        })
        .regex(/^(?=.*[@#$%^&*])/, {
            message: "password must be contain 1 special character"
        })
        .regex(/^(?=.*\d)/, {
            message: "password must be contain at least 1 number"
        }),
    phone: z
        .string({ invalid_type_error: "Phone number must be string" })
        .regex(/^(?:\+8801\d{9} | 01\d{9})$/, {
            message: "phone number must be valid for Bangladesh"
        }).optional(),
    address: z
        .string({ invalid_type_error: "address must be string" })
        .max(200, { message: "address cannot exceed 200 character" })
        .optional()
});


export const updateSchemaZod = z.object({
    name: z
        .string({ invalid_type_error: "name must be string" })
        .min(2, { message: "name must be contain at least 2 character" })
        .max(50, { message: "Name cannot exceed 50 characters" }).optional(),
    password: z
        .string({ invalid_type_error: "password must be string" })
        .min(8, { message: "password must be 8 character long" })
        .regex(/^(?=.*[A-Z])/, {
            message: "password must contain at least 1 upper case letter"
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "password must contain at least 1 special character"
        })
        .regex(/^(?=.*\d)/, {
            message: "password must contain at least 1 number"
        }).optional(),
    phone: z
        .string({ invalid_type_error: "phone number must be string" })
        .regex(/^(?: \+8801\d{9} | 01\d{9})$/, {
            message: "phone number must be valid for Bangladesh"
        }).optional(),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    isActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isDeleted: z
        .boolean({ invalid_type_error: "isDeleted must be true or false" })
        .optional(),
    isVerified: z
        .boolean({ invalid_type_error: "isVerified must be true or false" })
        .optional(),
    address: z
        .string({ invalid_type_error: "address must be string" })
        .max(200, { message: "address cannot exceed 200 character" })
        .optional()

})
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import z from "zod";

const router = Router()

router.post('/register',
    async (req: Request, res: Response, next: NextFunction) => {
        const createUserZodSchema = z.object({
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

        req.body = await createUserZodSchema.parseAsync(req.body)
        console.log(req.body);
    }
    , UserControllers.createUser)
router.get('/all-users', UserControllers.getAllUsers)

export const UserRoutes = router
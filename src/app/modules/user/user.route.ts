import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateSchemaZod } from "./user.validation";
import { validateRequest } from "../../middewars/validateRequest";
import { Router } from "express";
import { checkAuth } from "../../middewars/checkAuth";
import { Role } from "./user.interface";


const router = Router()


router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser)

router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.patch('/:id', validateRequest(updateSchemaZod), checkAuth(...Object.values(Role)), UserControllers.updateUser)

export const UserRoutes = router
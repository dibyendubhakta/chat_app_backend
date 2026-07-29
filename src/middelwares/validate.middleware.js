import z from "zod"
import { ErrorFunc } from "../utils/error_handler.util.js";

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next()
    } catch (e) {
        console.error(typeof e)
        throw new Error(e)
    }
}
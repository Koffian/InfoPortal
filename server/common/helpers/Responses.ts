import { Response } from "express";
import { API_Response } from "../types/API_Responses";


/** Вернуть респонс пользователю */
export function ReturnAPIResponse(res: Response, api_response: API_Response)
{
     res.status(api_response.httpCode).json(api_response);
}
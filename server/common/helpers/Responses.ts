import { Response } from "express";
import { API_Response } from "../types/API_Responses";


/** Вернуть респонс пользователю */
export function ReturnAPIResponse(res: Response, api_response: API_Response)
{
     console.log(new Date())
     console.log("Отправляем ответ на запрос с кодом " + api_response.httpCode + ": ")
     console.log(api_response);
     
     res.status(api_response.httpCode).json(api_response);
}
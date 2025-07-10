import axios from "axios";
import { HOST } from "../utils/constant";


export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true, // ✅ This is important for cookies
  });
  


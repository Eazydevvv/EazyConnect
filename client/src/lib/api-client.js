import axios from "axios";
import { HOST } from "../utils/constant";

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true, // ✅ REQUIRED for cookies to work cross-origin, especially on Safari
});

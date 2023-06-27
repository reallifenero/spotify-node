import axios from "axios";
import { accessToken } from "./auth";

/**
 * Axios Global Request Headers
 * https://github.com/axios/axios#global-axios-defaults
 */

axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

/**
 * Get Current User's Profile
 */

export const getCurrentUserProfile = () => axios.get("/me");

export interface ApiResponse<T> {
    result: T;
    message: string;
    success: boolean;
}
export interface UserProfileResponse {
  id: number;
  email: string;
  iat: number;
  exp: number;
  iss: string;
}
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: Partial<Record<string, string[]>>;
}

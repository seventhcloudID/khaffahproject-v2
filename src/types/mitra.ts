export type Gender = "L" | "P";

export interface MitraProfile {
  fullName: string;
  gender: Gender;
  birthDate: string;
  email: string;
  phone: string;
  avatarUrl?: string | null;
}

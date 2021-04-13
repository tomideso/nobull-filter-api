import UserProfileDto from "./UserProfileDto";

export enum UserRole {
  SUPERADMIN = "superadmin",
  PATIENT = "patient",
  DOCTOR = "doctor",
  HOSPITAL = "hospital",
}

export default interface AccountDto {
  id?: string;
  email: string;
  password: string;
  active: boolean;
  roles: UserRole[] | string[];
  isEmailVerified: boolean;
  userProfile: UserProfileDto | string;
  hashPassword(): AccountDto;
  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean;
}

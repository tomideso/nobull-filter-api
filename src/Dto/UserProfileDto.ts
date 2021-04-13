import AccountDto from "./AccountDto";
// import AddressDto from "./AddressDto";

export default interface UserProfileDto {
  firstname: string;
  lastname: string;
  middlename?: string;
  gender?: string;
  occupation?: string;
  medicare?: string;
  dva?: string;
  photo_url?: string;
  signature?: string;
  about?: string;
  height?: string;
  weight?: string;
  timezone?: string;
  age?: Date;
  title?: string;
  account: AccountDto | string;
  // address?:AddressDto | string
}

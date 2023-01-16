import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Match } from "./match.decorator";

export interface IRegister {
  email: string;
  nickName: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export class RegisterDTO implements IRegister {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(21)
  @MinLength(3)
  nickName!: string;

  @IsString()
  @MaxLength(50)
  @MinLength(3)
  fullName!: string;

  @IsPhoneNumber("VN")
  phone!: string;

  @IsString()
  @MinLength(8)
  // IsStrongPassword
  // @Matches(
  //   `^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$`,
  // )
  password!: string;

  @Match("password", {
    message: "confirm password is not the same",
  })
  confirmPassword!: string;
}

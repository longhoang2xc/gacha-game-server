import {
  IsBoolean,
  IsDivisibleBy,
  IsEmail,
  IsInt,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { Match } from "./customValidatorDTO/match.decorator";

export class RegisterDTO {
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

export class LoginDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class CarDTO {
  @IsString()
  @MaxLength(8)
  carName!: string;
}

export class CarRaceDTO {
  @IsUUID()
  carId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  difficultLevel!: number;
}
export class CarMaintainDTO {
  @IsUUID()
  carId!: string;
}

export class CarInfoDTO {
  @IsUUID()
  id!: string;
}

export class StakingDTO {
  @IsInt()
  @Min(100)
  @IsDivisibleBy(100)
  amount!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  stakingLevel!: string;
}

export class StakingWithdrawDTO {
  @IsInt()
  @Min(100)
  amount!: number;

  @IsBoolean()
  withdrawFull!: boolean;
}

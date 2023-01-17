// type TGender = "male" | "female" | "other";
// const GENDER_OPTIONS = ["male", "female", "other"];

export interface IPlayer {
  id: string;
  fullName: string;
  nickName: string;
  email: string;
  phone: string;
  password: string;
  bankBalance: number;
  isHaveFirstCar: boolean;
}

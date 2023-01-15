type TGender = "male" | "female" | "other";
const GENDER_OPTIONS = ["male", "female", "other"];

export interface ITestCreateBody {
  firstName: string;
  lastName: string;
  age: number;
}

export interface ITestCreateResponse {
  firstName: string;
  lastName: string;
  age: number;
}

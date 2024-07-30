export interface UserTypes {
  callBack?: () => void;
  _id: string;
  role: "ADMIN" | "USER" | "MANAGER" | "SUPERADMIN";
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  profile: string;
  passwordResetToken?: string;
}

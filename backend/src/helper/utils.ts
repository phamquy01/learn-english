import * as bcrypt from 'bcryptjs';
const salt = 10;

export const hashedPasswordHelper = async (password: string) => {
  try {
    return await bcrypt.hash(password, bcrypt.genSaltSync(salt));
  } catch (error) {
    console.log(error);
  }
};

export const comparePasswordHelper = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compareSync(password, hashedPassword);
  } catch (error) {
    console.log(error);
  }
};

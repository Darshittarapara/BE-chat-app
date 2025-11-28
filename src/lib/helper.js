import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  console.log('Generated salt:', salt);
  return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = (user, res) => {

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );        
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
}

export default generateToken;
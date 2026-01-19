import jwt from 'jsonwebtoken';

export const generateJWTToken = async (userId) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: '7d'});
    return token;
}

export const generateVerificationToken = () => {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    return token;
}
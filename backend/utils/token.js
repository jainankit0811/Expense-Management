import jwt from 'jsonwebtoken';

const generateToken = async (userId) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        return token;
    }
    catch (error) {
        console.log("Error in generating token", error);
    }

};
export default generateToken;
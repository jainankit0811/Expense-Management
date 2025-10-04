import jwt from 'jsonwebtoken';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized Tocken' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log('Error in protectRoute middleware: ', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default protectRoute;

import jwt from "jsonwebtoken";


const createToken = (res, adminId) => {
    const token = jwt.sign({ adminId}, process.env.JWT_SECRET, {
        expiresIn: "20d",  
    });


    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return token;
};

export default createToken;
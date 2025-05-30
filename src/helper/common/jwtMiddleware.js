import jwt from 'jsonwebtoken';

const authMiddleware = async(req, res, next) => {
    let token = req.headers["X-access-token"] || req.headers.authorization;
    if(!token){
        res.status(401).send({
            status:false,
            message: "Required authorization header not found"
        });
        return;
    }

    if(token.startsWith("Bearer ")){
        token = token.slice(7,token.length);
    }

    const isverified = jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if(error){
            res.status(401).send({
                status:false,
                message:"Token is not valid"
            })
        }
        else{
            req.user = decoded;
            next();
        }
    })
}

export default authMiddleware;
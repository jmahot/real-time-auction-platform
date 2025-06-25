const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Token manquant");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Token invalide");
    req.userId = decoded.userId; // on récupère l'id de l'utilisateur pour l'utiliser ensuite dans la route
    next();
  });
}

module.exports = verifyToken;

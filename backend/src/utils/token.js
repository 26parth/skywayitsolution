  import jwt from "jsonwebtoken";

  //
  // ================= USER TOKENS =================
  //

  export const createUserAccessToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );
  };

  export const createUserRefreshToken = (user) => {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
    );
  };

  export const verifyUserAccessToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);

  export const verifyUserRefreshToken = (token) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);


  //
  // ================= ADMIN TOKENS =================
  //

  export const createAdminAccessToken = (admin) => {
    return jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "10m" }
    );
  };

  export const createAdminRefreshToken = (admin) => {
    return jwt.sign(
      { id: admin._id },
      process.env.ADMIN_JWT_REFRESH_SECRET,
      { expiresIn: process.env.ADMIN_REFRESH_EXPIRES_IN || "30d" }
    );
  };

  export const verifyAdminAccessToken = (token) =>
    jwt.verify(token, process.env.ADMIN_JWT_SECRET);

  export const verifyAdminRefreshToken = (token) =>
    jwt.verify(token, process.env.ADMIN_JWT_REFRESH_SECRET);
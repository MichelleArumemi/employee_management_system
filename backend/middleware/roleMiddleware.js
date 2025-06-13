// import jwt from "jsonwebtoken";
// import User from "../models/Employee.js";

// // Authentication middleware
// export const authenticate = async (req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return next();
//   }
  
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided or invalid format"
//       });
//     }
    
//     const token = authHeader.split(" ")[1];
    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed - no token"
//       });
//     }

//     // Use environment variable for JWT secret
//     const jwtSecret = process.env.JWT_SECRET || "secret_secret";
//     const decodedToken = jwt.verify(token, jwtSecret);
    
//     // Get user from database to ensure they still exist
//     const user = await User.findById(decodedToken.id).select('-password');
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User no longer exists"
//       });
//     }

//     // Check if user changed password after token was issued
//     if (user.changedPasswordAfter && user.changedPasswordAfter(decodedToken.iat)) {
//       return res.status(401).json({
//         success: false,
//         message: "User recently changed password. Please log in again."
//       });
//     }

//     // Attach user to request
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Authentication error:", err);
//     return res.status(401).json({
//       success: false,
//       message: "Authentication failed"
//     });
//   }
// };

// // Role-based authorization middleware
// export const roleCheck = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required"
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Insufficient permissions."
//       });
//     }

//     next();
//   };
// };

// // Specific role middlewares for convenience
// export const adminOnly = roleCheck('admin');
// export const hrOnly = roleCheck('hr');
// export const adminOrHr = roleCheck('admin', 'hr');

// // Default export for backward compatibility
// export default authenticate;

// backend/middleware/roleMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/employeeModel.js";

// Authentication middleware
export const authenticate = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    // This check should prevent the error, but let's be absolutely explicit
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No Authorization header provided."
      });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization header format. Expected 'Bearer token'."
      });
    }

    const token = authHeader.split(" ")[1]; // Line 11 in your original trace

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed - token is missing after 'Bearer'."
      });
    }

    // Use environment variable for JWT secret
    const jwtSecret = process.env.JWT_SECRET || "secret_secret";
    const decodedToken = jwt.verify(token, jwtSecret);

    // Get user from database to ensure they still exist
    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists."
      });
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter && user.changedPasswordAfter(decodedToken.iat)) {
      return res.status(401).json({
        success: false,
        message: "User recently changed password. Please log in again."
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message); // Log the specific error message
    // If it's a JWT error (e.g., malformed, expired), provide a specific message
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid or expired token."
      });
    }
    return res.status(500).json({ // Changed to 500 for general server errors
      success: false,
      message: "Internal Server Error during authentication."
    });
  }
};

// Role-based authorization middleware
export const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required (user not attached to request)."
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions."
      });
    }

    next();
  };
};

// Specific role middlewares for convenience
export const adminOnly = roleCheck('admin');
export const hrOnly = roleCheck('hr');
export const adminOrHr = roleCheck('admin', 'hr');

// Default export for backward compatibility
export default authenticate;
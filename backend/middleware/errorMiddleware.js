// const errorHandler = (err, req, res, next) => {
//   console.error(err.stack);

//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";

//   res.status(statusCode).json({
//     success: false,
//     message,
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   });
// };

// // 404 Not Found Middleware
// const notFound = (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// };

// export default {
//   errorHandler,
//   notFound
// };
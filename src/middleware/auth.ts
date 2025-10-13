import { NextFunction, Request, Response } from "express";

// API Key validation middleware
export function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"] as string;
  const expectedApiKey = process.env.API_KEY;

  // Check if API_KEY is configured
  if (!expectedApiKey) {
    console.error("API_KEY environment variable is not set");
    return res.status(500).json({
      success: false,
      error: "Server configuration error",
      message: "API authentication not configured",
    });
  }

  // Check if API key is provided
  if (!apiKey) {
    console.warn("Request received without API key");
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "API key is required. Please provide 'x-api-key' header",
    });
  }

  // Validate API key
  if (apiKey !== expectedApiKey) {
    console.warn("Invalid API key attempt:", apiKey.substring(0, 8) + "...");
    return res.status(403).json({
      success: false,
      error: "Forbidden",
      message: "Invalid API key",
    });
  }

  // API key is valid, proceed
  next();
}

// Optional: Multiple API keys support
export function validateApiKeyMultiple(validKeys: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "API key is required",
      });
    }

    if (!validKeys.includes(apiKey)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Invalid API key",
      });
    }

    next();
  };
}

// Base error class for application-wide errors
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class SolarCalculationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'SolarCalculationError';
  }
}

export class PropertyError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'PropertyError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}
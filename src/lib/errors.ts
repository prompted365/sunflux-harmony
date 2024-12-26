export class SolarCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SolarCalculationError';
  }
}

export class PropertyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PropertyError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
export type SessionConfig = {
  mode: string
  operations: Operation[]
  termA: { min: number; max: number; multiple: number }
  termB: { min: number; max: number; multiple: number }
  firebaseUid?: string
  timeLimit: number
}

export type Session = {
  sessionId: string
  timeLimit: number
}

// Update the existing Operation type
export type Operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'

// Add this new type
export type OperationSymbol = 'add' | 'minus' | 'times' | 'divide'

// Add this new interface
export interface OperationOption {
  symbol: OperationSymbol
  name: Operation
}

export type RangeValue = '1-10' | '1-20' | '1-100'

export type NumberPattern =
  | 'evens'
  | 'odds'
  | 'fives'
  | 'tens'
  | 'squares'
  | 'cubes'
  | 'primes'
  | 'any'

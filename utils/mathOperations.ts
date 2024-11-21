import { Operation } from '../types/session'

export const getOperationSymbol = (operation: Operation): string => {
  const symbols: { [key: string]: string } = {
    addition: '+',
    subtraction: '-',
    division: '÷',
    multiplication: '×',
  }
  return symbols[operation.toLowerCase()] || operation
}

export const getFirebaseErrorMessage = (error: unknown): string => {
  console.error('Raw error in getFirebaseErrorMessage:', error)

  if (error instanceof Error) {
    console.error('Error instance details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })

    if ('code' in error) {
      const firebaseError = error as { code: string }
      console.error('Firebase error code:', firebaseError.code)

      switch (firebaseError.code) {
        case 'auth/invalid-login-credentials':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Invalid email or password. Please try again.'
        case 'auth/too-many-requests':
          return 'Too many failed login attempts. Please try again later.'
        case 'auth/email-already-in-use':
          return 'An account with this email already exists.'
        case 'auth/weak-password':
          return 'Password should be at least 6 characters long.'
        case 'auth/invalid-email':
          return 'The email address is badly formatted.'
        case 'auth/operation-not-allowed':
          return 'Email/password accounts are not enabled.'
        case 'auth/internal-error':
          return 'An internal error occurred. Please try again later.'
        case 'auth/user-disabled':
          return 'This account has been disabled. Please contact support.'
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection and try again.'
        case 'auth/requires-recent-login':
          return 'This operation is sensitive and requires recent authentication. Please log in again.'
        case 'auth/invalid-verification-code':
          return 'The verification code is invalid. Please try again.'
        case 'auth/invalid-verification-id':
          return 'The verification ID is invalid. Please try again.'
        default:
          console.error('Unhandled Firebase error code:', firebaseError.code)
          return `An error occurred (${firebaseError.code}). Please try again.`
      }
    }

    console.error('Non-Firebase error:', error.message)
    return error.message
  }

  console.error('Unknown error type:', error)
  return 'An unexpected error occurred. Please try again.'
}

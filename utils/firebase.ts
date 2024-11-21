import auth from '@react-native-firebase/auth'

export const getIdToken = async (): Promise<string> => {
  const currentUser = auth().currentUser
  if (!currentUser) {
    throw new Error('No user is currently signed in')
  }

  try {
    const token = await currentUser.getIdToken(true)
    return token
  } catch (error) {
    console.error('Error getting ID token:', error)
    throw error
  }
}

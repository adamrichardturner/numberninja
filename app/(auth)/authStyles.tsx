import { StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../colors'

const { width, height } = Dimensions.get('window')
const inputWidth = width * 0.9

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 40,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.darkNavy,
  },
  input: {
    borderColor: colors.darkGray,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    width: inputWidth,
    fontSize: 16,
    backgroundColor: colors.white,
    color: '#000000',
  },
  placeholderTextColor: {
    color: colors.darkGray,
  },
  link: {
    marginTop: 20,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subLink: {
    color: colors.darkGray,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: inputWidth,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    width: inputWidth,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.darkGray,
    flex: 1,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 0,
  },
  buttonContainer: {
    marginBottom: 15,
    gap: 10,
    width: inputWidth,
  },
  subText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 20,
  },
})

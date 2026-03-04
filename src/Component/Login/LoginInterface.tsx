export interface LoginFormData {
  username: string;
  role: 'kid' | 'parent';
  userPassword: string;
  agreedToTerms: boolean;
}

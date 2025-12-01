export type UserData = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image?: string;
  token: string;
};

export type LoginScreenProps = {
  onLogin: (userData: UserData) => void;
};

export type DashboardProps = {
  userData: UserData;
  onLogout: () => void;
};

export type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userData: UserData;
  navigation?: any; // Navigation prop for menu item navigation
};

export type MenuItem = {
  id: string;
  title: string;
  icon: string;
  color: string;
};
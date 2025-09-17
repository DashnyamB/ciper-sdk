interface Permission {
  id: string;
  name: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  identifier: string;
  description?: string;
  permissions: Permission[];
}

export interface CurrentUser {
  id: string;
  email: string;
  role: Role;
}

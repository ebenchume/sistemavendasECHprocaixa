export type UserRole = 'ADMIN' | 'GERENTE' | 'OPERADOR' | 'ESPECIALISTA';

export interface UserPermissions {
  canOpenCloseCashRegister: boolean; // Abrir / Fechar Caixa
  canApplyCustomDiscount: boolean;   // Aplicar descontos manuais
  canCancelSales: boolean;           // Cancelar vendas emitidas
  canManageStock: boolean;           // Ajustar stock e cadastrar produtos
  canManageCreditAndDebt: boolean;   // Alterar limites de fiado e amortizar dívidas
  canViewFinancialReports: boolean;  // Ver faturamento e dashboards
  canManageUsers: boolean;           // Criar e editar utilizadores
  canChangeNicheAndSettings: boolean;// Alterar nichos e feature flags
}

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  role: UserRole;
  roleLabel: string;
  pinCode?: string; // PIN de 4 dígitos para autenticação rápida no POS
  isActive: boolean;
  avatarColor: string;
  assignedNiche?: string; // 'ALL' ou nicho específico
  lastLogin?: string;
  createdAt: string;
  permissions: UserPermissions;
}

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  Users, 
  Key, 
  Plus, 
  Search, 
  Lock, 
  Unlock, 
  Check, 
  Edit3, 
  Clock, 
  Mail, 
  Phone, 
  UserX,
  BadgeCheck,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { AppUser, UserRole, UserPermissions } from '../../types/user';
import { BusinessNicheConfig } from '../../types/business';

interface UserManagementProps {
  users: AppUser[];
  currentUser: AppUser;
  config: BusinessNicheConfig;
  onAddUser: (user: AppUser) => void;
  onUpdateUser: (user: AppUser) => void;
  onSwitchUser: (user: AppUser) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  config,
  onAddUser,
  onUpdateUser,
  onSwitchUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form states for creating / editing user
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('OPERADOR');
  const [pinCode, setPinCode] = useState('1234');
  const [assignedNiche, setAssignedNiche] = useState('ALL');
  const [permissions, setPermissions] = useState<UserPermissions>({
    canOpenCloseCashRegister: true,
    canApplyCustomDiscount: false,
    canCancelSales: false,
    canManageStock: false,
    canManageCreditAndDebt: false,
    canViewFinancialReports: false,
    canManageUsers: false,
    canChangeNicheAndSettings: false,
  });

  // Switch operator modal
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [targetUserToSwitch, setTargetUserToSwitch] = useState<AppUser | null>(null);
  const [pinError, setPinError] = useState('');

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'ADMIN':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <ShieldAlert size={12} className="text-purple-700" />
            Administrador
          </span>
        );
      case 'GERENTE':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <Briefcase size={12} className="text-emerald-700" />
            Gerente
          </span>
        );
      case 'OPERADOR':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <UserCheck size={12} className="text-amber-700" />
            Operador de Caixa
          </span>
        );
      case 'ESPECIALISTA':
        return (
          <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <ShieldCheck size={12} className="text-cyan-700" />
            Técnico / Especialista
          </span>
        );
    }
  };

  const handleRoleSelectInForm = (newRole: UserRole) => {
    setRole(newRole);
    // Presets for permissions based on role
    if (newRole === 'ADMIN') {
      setPermissions({
        canOpenCloseCashRegister: true,
        canApplyCustomDiscount: true,
        canCancelSales: true,
        canManageStock: true,
        canManageCreditAndDebt: true,
        canViewFinancialReports: true,
        canManageUsers: true,
        canChangeNicheAndSettings: true,
      });
    } else if (newRole === 'GERENTE') {
      setPermissions({
        canOpenCloseCashRegister: true,
        canApplyCustomDiscount: true,
        canCancelSales: true,
        canManageStock: true,
        canManageCreditAndDebt: true,
        canViewFinancialReports: true,
        canManageUsers: false,
        canChangeNicheAndSettings: false,
      });
    } else if (newRole === 'OPERADOR') {
      setPermissions({
        canOpenCloseCashRegister: true,
        canApplyCustomDiscount: false,
        canCancelSales: false,
        canManageStock: false,
        canManageCreditAndDebt: false,
        canViewFinancialReports: false,
        canManageUsers: false,
        canChangeNicheAndSettings: false,
      });
    } else {
      setPermissions({
        canOpenCloseCashRegister: false,
        canApplyCustomDiscount: false,
        canCancelSales: false,
        canManageStock: true,
        canManageCreditAndDebt: false,
        canViewFinancialReports: false,
        canManageUsers: false,
        canChangeNicheAndSettings: false,
      });
    }
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFullName('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPinCode('1234');
    setAssignedNiche('ALL');
    handleRoleSelectInForm('OPERADOR');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AppUser) => {
    setEditingUser(user);
    setFullName(user.name);
    setUsername(user.username);
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setRole(user.role);
    setPinCode(user.pinCode || '1234');
    setAssignedNiche(user.assignedNiche || 'ALL');
    setPermissions({ ...user.permissions });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      alert('Por favor preencha o Nome Completo e o Nome de Utilizador.');
      return;
    }

    const roleLabels: Record<UserRole, string> = {
      ADMIN: 'Administrador do Sistema',
      GERENTE: 'Gerente Geral',
      OPERADOR: 'Operador de Caixa',
      ESPECIALISTA: 'Especialista / Técnico',
    };

    const avatarColors = [
      'from-indigo-600 to-purple-600',
      'from-emerald-600 to-teal-600',
      'from-amber-600 to-orange-600',
      'from-cyan-600 to-blue-600',
      'from-rose-600 to-pink-600',
    ];

    if (editingUser) {
      const updated: AppUser = {
        ...editingUser,
        name: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        role,
        roleLabel: roleLabels[role],
        pinCode,
        assignedNiche,
        permissions,
      };
      onUpdateUser(updated);
    } else {
      const newUser: AppUser = {
        id: 'usr-' + Date.now().toString(36),
        name: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        role,
        roleLabel: roleLabels[role],
        pinCode,
        isActive: true,
        avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        assignedNiche,
        createdAt: new Date().toISOString().substring(0, 10),
        lastLogin: 'Nunca acedeu',
        permissions,
      };
      onAddUser(newUser);
    }

    setIsModalOpen(false);
  };

  const handleToggleUserActive = (user: AppUser) => {
    if (user.id === currentUser.id) {
      alert('Não é possível desativar o utilizador atualmente em sessão.');
      return;
    }
    onUpdateUser({
      ...user,
      isActive: !user.isActive,
    });
  };

  const handleOpenSwitchModal = (user: AppUser) => {
    setTargetUserToSwitch(user);
    setPinInput('');
    setPinError('');
    setIsSwitchModalOpen(true);
  };

  const handleConfirmSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserToSwitch) return;

    if (targetUserToSwitch.pinCode && pinInput !== targetUserToSwitch.pinCode) {
      setPinError('PIN de 4 dígitos incorreto! Tente novamente.');
      return;
    }

    onSwitchUser({
      ...targetUserToSwitch,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
    setIsSwitchModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              SEGURANÇA & RBAC
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Gestão de Utilizadores e Controlo de Acessos
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de perfis (Administrador, Gerente, Operador de Caixa), permissões granulares e PIN de autenticação.
          </p>
        </div>

        {/* Current Active User Card & Action */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentUser.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sessão Atual</span>
              <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-purple-700 font-semibold">{currentUser.roleLabel}</span>
            </div>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Plus size={15} />
            <span>Criar Novo Utilizador</span>
          </button>
        </div>
      </div>

      {/* Role Counts & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Administradores</span>
            <div className="text-xl font-black text-purple-700">
              {users.filter((u) => u.role === 'ADMIN').length}
            </div>
          </div>
          <ShieldAlert size={20} className="text-purple-400" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Gerentes</span>
            <div className="text-xl font-black text-emerald-700">
              {users.filter((u) => u.role === 'GERENTE').length}
            </div>
          </div>
          <Briefcase size={20} className="text-emerald-400" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Operadores de Caixa</span>
            <div className="text-xl font-black text-amber-700">
              {users.filter((u) => u.role === 'OPERADOR').length}
            </div>
          </div>
          <UserCheck size={20} className="text-amber-400" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Ativos</span>
            <div className="text-xl font-black text-slate-900">
              {users.filter((u) => u.isActive).length} / {users.length}
            </div>
          </div>
          <Users size={20} className="text-slate-400" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setSelectedRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'ALL'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'ADMIN'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setSelectedRoleFilter('GERENTE')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'GERENTE'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Gerentes
          </button>
          <button
            onClick={() => setSelectedRoleFilter('OPERADOR')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'OPERADOR'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Operadores
          </button>
          <button
            onClick={() => setSelectedRoleFilter('ESPECIALISTA')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'ESPECIALISTA'
                ? 'bg-cyan-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Especialistas
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou utilizador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isCurrentUser = user.id === currentUser.id;

          return (
            <div
              key={user.id}
              className={`bg-white border rounded-2xl p-4 shadow-xs flex flex-col justify-between transition ${
                isCurrentUser
                  ? 'border-purple-400 ring-2 ring-purple-100'
                  : user.isActive
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              {/* Top User Card Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${user.avatarColor} text-white font-black flex items-center justify-center text-sm shadow-xs`}>
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight flex items-center gap-1.5">
                        {user.name}
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                            Você
                          </span>
                        )}
                      </h4>
                      <span className="text-xs font-mono text-slate-400">@{user.username}</span>
                    </div>
                  </div>

                  {getRoleBadge(user.role)}
                </div>

                {/* Details */}
                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {user.email && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock size={11} /> Último login: {user.lastLogin || 'Nunca'}
                    </span>
                    <span className="font-mono font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      PIN: {user.pinCode || '----'}
                    </span>
                  </div>
                </div>

                {/* Permissions Snapshot */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Permissões Ativas:
                  </span>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {user.permissions.canOpenCloseCashRegister && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded">
                        ✓ Caixa POS
                      </span>
                    )}
                    {user.permissions.canCancelSales && (
                      <span className="bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded">
                        ✓ Cancelar Vendas
                      </span>
                    )}
                    {user.permissions.canManageStock && (
                      <span className="bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded">
                        ✓ Stock
                      </span>
                    )}
                    {user.permissions.canManageCreditAndDebt && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">
                        ✓ Fiado & Crédito
                      </span>
                    )}
                    {user.permissions.canViewFinancialReports && (
                      <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.2 rounded">
                        ✓ Dashboards
                      </span>
                    )}
                    {user.permissions.canManageUsers && (
                      <span className="bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.2 rounded">
                        ✓ Adm Utilizadores
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenSwitchModal(user)}
                  disabled={isCurrentUser || !user.isActive}
                  className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1"
                >
                  <Key size={12} />
                  <span>Assumir Turno</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(user)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                  title="Editar Utilizador"
                >
                  <Edit3 size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleUserActive(user)}
                  disabled={isCurrentUser}
                  className={`p-1.5 rounded-lg text-xs font-medium transition ${
                    user.isActive
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  } disabled:opacity-30`}
                  title={user.isActive ? 'Desativar Acesso' : 'Ativar Acesso'}
                >
                  {user.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400">
                  {editingUser ? 'Atualização de Cadastro' : 'Novo Utilizador do Sistema'}
                </span>
                <h3 className="font-bold text-base">
                  {editingUser ? `Editar: ${editingUser.name}` : 'Criar Utilizador (Admin, Gerente, Operador)'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Role Selector Cards */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  1. Perfil / Nível de Acesso (Cargo):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['ADMIN', 'GERENTE', 'OPERADOR', 'ESPECIALISTA'] as UserRole[]).map((r) => {
                    const isSel = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleSelectInForm(r)}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                          isSel
                            ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-600/30'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {r === 'ADMIN' && <ShieldAlert size={18} className="text-purple-600" />}
                        {r === 'GERENTE' && <Briefcase size={18} className="text-emerald-600" />}
                        {r === 'OPERADOR' && <UserCheck size={18} className="text-amber-600" />}
                        {r === 'ESPECIALISTA' && <ShieldCheck size={18} className="text-cyan-600" />}
                        <span className="text-[11px] font-bold">{r}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Basic Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Manuel dos Santos"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome de Utilizador (Login) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: manuel.santos"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN Numérico de 4 Dígitos (Login Rápido)</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="1234"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono text-center tracking-widest font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefone de Contacto</label>
                  <input
                    type="text"
                    placeholder="+258 84 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Email Profissional</label>
                  <input
                    type="email"
                    placeholder="manuel@empresa.co.mz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div className="border-t border-slate-200 pt-3">
                <label className="block font-bold text-slate-800 mb-2">
                  2. Permissões Granulares do Utilizador:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'canOpenCloseCashRegister', label: 'Operar Caixa e Abrir/Fechar Turno' },
                    { key: 'canApplyCustomDiscount', label: 'Aplicar Descontos Manuais' },
                    { key: 'canCancelSales', label: 'Cancelar e Estornar Vendas Emitidas' },
                    { key: 'canManageStock', label: 'Ajustar Inventário e Criar Produtos' },
                    { key: 'canManageCreditAndDebt', label: 'Conceder Fiado e Liquidar Dívidas' },
                    { key: 'canViewFinancialReports', label: 'Ver Relatórios Financeiros e BI' },
                    { key: 'canManageUsers', label: 'Criar e Administrar Utilizadores' },
                    { key: 'canChangeNicheAndSettings', label: 'Alterar Nicho e Feature Flags' },
                  ].map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={permissions[perm.key as keyof UserPermissions]}
                        onChange={(e) =>
                          setPermissions({
                            ...permissions,
                            [perm.key]: e.target.checked,
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-[11px] font-medium text-slate-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 -mx-5 -mb-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{editingUser ? 'Salvar Alterações' : 'Criar Utilizador'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Switch Operator Modal with PIN */}
      {isSwitchModalOpen && targetUserToSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4 animate-in fade-in zoom-in-95 text-center">
            <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr ${targetUserToSwitch.avatarColor} text-white font-black flex items-center justify-center text-lg shadow-md`}>
              {targetUserToSwitch.name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">{targetUserToSwitch.name}</h3>
              <p className="text-xs text-purple-700 font-semibold">{targetUserToSwitch.roleLabel}</p>
              <p className="text-xs text-slate-500 mt-1">
                Introduza o PIN de 4 dígitos para assumir este operador no caixa:
              </p>
            </div>

            <form onSubmit={handleConfirmSwitch} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="• • • •"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-40 mx-auto text-2xl font-bold text-center tracking-widest p-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {pinError && (
                <p className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
                  <AlertTriangle size={12} /> {pinError}
                </p>
              )}

              <p className="text-[10px] text-slate-400">
                Dica de demonstração: o PIN deste operador é <strong>{targetUserToSwitch.pinCode || '1234'}</strong>
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSwitchModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs"
                >
                  Confirmar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

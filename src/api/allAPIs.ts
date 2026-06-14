import { httpService } from '../services/http';
import { BASE_URL } from './baseURL';

export const pixelsAPI = {
    // Auth & Settings
    changePassword: (payload: any) => httpService.postRequest(BASE_URL + 'auth/change-password', payload),
    updateProfile: (payload: any) => httpService.postRequest(BASE_URL + 'auth/update-profile', payload),
    updateLogo: (payload: any) => httpService.postRequest(BASE_URL + 'auth/update-logo', payload),

    // Notifications
    getNotifications: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'notifications/get', payload),
    registerNotification: (payload: any) => httpService.postRequest(BASE_URL + 'notifications/register', payload),
    updateNotification: (payload: any) => httpService.postRequest(BASE_URL + 'notifications/update', payload),
    markAllNotificationsRead: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'notifications/mark-all-read', payload),

    // Dashboard
    getDashboardData: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'dashboard/data', payload),

    // Wallet (USDT)
    getWalletSummary: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'wallet/summary', payload),
    getWalletTransactions: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'wallet/transactions', payload),
    requestDeposit: (payload: { user_id: number; amount: number; network: string; tx_hash?: string; screenshot: string }) =>
        httpService.postRequest(BASE_URL + 'wallet/deposit', payload),
    invest: (payload: { user_id: number; amount: number }) => httpService.postRequest(BASE_URL + 'wallet/invest', payload),
    requestWithdrawal: (payload: { user_id: number; amount: number; wallet_address: string; network: string }) =>
        httpService.postRequest(BASE_URL + 'wallet/withdraw', payload),

    // Plans
    getPlans: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'plans/get', payload),

    // Referral
    getReferralSummary: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'referral/summary', payload),
    getReferralTree: (payload: { user_id: number }) => httpService.postRequest(BASE_URL + 'referral/tree', payload),
    validateReferralCode: (payload: { ref_code: string }) => httpService.postRequest(BASE_URL + 'referral/validate', payload),

    // Admin analysis
    getAnalysisOverview: (payload: { admin_id: number }) => httpService.postRequest(BASE_URL + 'analysis/overview', payload),
    getAnalysisUsers: (payload: { admin_id: number }) => httpService.postRequest(BASE_URL + 'analysis/users', payload),
    getAnalysisUser: (payload: { admin_id: number; user_id: number }) => httpService.postRequest(BASE_URL + 'analysis/user', payload),
    getAnalysisNetwork: (payload: { admin_id: number }) => httpService.postRequest(BASE_URL + 'analysis/network', payload),

    // Admin approvals
    getPendingDeposits: () => httpService.postRequest(BASE_URL + 'admin/deposits/pending', {}),
    approveDeposit: (payload: { deposit_id: number; admin_id?: number }) => httpService.postRequest(BASE_URL + 'admin/deposits/approve', payload),
    rejectDeposit: (payload: { deposit_id: number; admin_id?: number }) => httpService.postRequest(BASE_URL + 'admin/deposits/reject', payload),
    getPendingWithdrawals: () => httpService.postRequest(BASE_URL + 'admin/withdrawals/pending', {}),
    approveWithdrawal: (payload: { withdrawal_id: number; admin_id?: number }) => httpService.postRequest(BASE_URL + 'admin/withdrawals/approve', payload),
    rejectWithdrawal: (payload: { withdrawal_id: number; admin_id?: number }) => httpService.postRequest(BASE_URL + 'admin/withdrawals/reject', payload),
};

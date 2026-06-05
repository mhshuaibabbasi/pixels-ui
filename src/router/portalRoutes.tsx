import Dashboard from "@/portal/Dashboard";
import ProfilePage from "@/portal/profile/ProfilePage";
import SettingsPage from "@/portal/settings/SettingsPage";
import NotificationsPage from "@/portal/notifications/NotificationsPage";
import WalletPage from "@/portal/wallet/WalletPage";
import ReferralPage from "@/portal/referral/ReferralPage";
import ApprovalsPage from "@/portal/approvals/ApprovalsPage";

interface PortalRoute {
  label: string;
  path: string;
  element: React.ReactNode;
}

const PortalRoutesList: PortalRoute[] = [
  { label: "dashboard", path: "", element: <Dashboard /> },
  { label: "wallet", path: "wallet", element: <WalletPage /> },
  { label: "referral", path: "referral", element: <ReferralPage /> },
  { label: "approvals", path: "approvals", element: <ApprovalsPage /> },
  { label: "profile", path: "profile", element: <ProfilePage /> },
  { label: "settings", path: "settings", element: <SettingsPage /> },
  { label: "notifications", path: "notifications", element: <NotificationsPage /> },
];

export default PortalRoutesList;

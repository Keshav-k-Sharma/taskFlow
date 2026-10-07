import ProtectedPage from "@/components/layout/ProtectedPage";
import DashboardView from "@/components/dashboard/DashboardView";
/** Guards and displays the dashboard route. */
export default function DashboardPage() {
  return (
    <ProtectedPage>
      <DashboardView />
    </ProtectedPage>
  );
}

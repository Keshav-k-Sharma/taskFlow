import ProtectedPage from "@/components/layout/ProtectedPage";
import ProjectsView from "@/components/projects/ProjectsView";
/** Guards and displays owned projects. */
export default function ProjectsPage() {
  return (
    <ProtectedPage>
      <ProjectsView />
    </ProtectedPage>
  );
}

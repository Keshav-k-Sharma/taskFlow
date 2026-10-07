import ProtectedPage from "@/components/layout/ProtectedPage";
import ProjectDetail from "@/components/projects/ProjectDetail";
/** Resolves the App Router project identifier before rendering. */
export default async function ProjectPage({ params }) {
  const { id } = await params;
  return (
    <ProtectedPage>
      <ProjectDetail id={id} />
    </ProtectedPage>
  );
}

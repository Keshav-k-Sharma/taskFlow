import { useLocalSearchParams } from "expo-router";
import ProjectDetailScreen from "../../../src/screens/ProjectDetailScreen";
/** Resolves the project detail route. */
export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  return <ProjectDetailScreen id={id} />;
}

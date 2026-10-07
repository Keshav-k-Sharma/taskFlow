import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { router } from "expo-router";
import useResource from "../hooks/useResource";
import useDebounce from "../hooks/useDebounce";
import { PROJECT_STATUSES, label } from "../utils/validators";
import {
  Button,
  Choice,
  colors,
  Empty,
  ErrorBanner,
  Field,
  Loading,
  Screen,
  styles,
} from "../components/ui";

/** Lists owned projects with server-side search and status filtering. */
export default function ProjectsScreen() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debounced = useDebounce(search);
  const { data, loading, error, refresh } = useResource("/projects", {
    ...(debounced && { search: debounced }),
    ...(status && { status }),
  });
  return (
    <Screen>
      <FlatList
        data={data?.projects || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.field}>
            <Text style={styles.title}>Projects</Text>
            <Field
              label="Search projects"
              value={search}
              onChangeText={setSearch}
            />
            <Choice
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "", label: "All statuses" },
                ...PROJECT_STATUSES.map((value) => ({
                  value,
                  label: label(value),
                })),
              ]}
            />
            <ErrorBanner message={error} retry={refresh} />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <Loading />
          ) : (
            !error && (
              <Empty
                title={
                  search || status ? "No matching projects" : "No projects yet"
                }
                message="Create projects on the web, then pull to refresh here."
              />
            )
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.badge}>{label(item.status)}</Text>
            <Text style={styles.heading}>{item.name}</Text>
            <Text style={styles.muted}>
              {item.description || "No description"}
            </Text>
            <Button
              secondary
              title="View project"
              onPress={() =>
                router.push({
                  pathname: "/projects/[id]",
                  params: { id: item.id },
                })
              }
            />
          </View>
        )}
      />
    </Screen>
  );
}

import { Text, View } from "react-native";
import { tokens } from "@vocalink/ui";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: tokens.type.h1, fontWeight: "800" }}>VocaLink — Phase 0</Text>
      <Text>Skill → Training → Certification → Work</Text>
      <Text style={{ marginTop: 12, color: tokens.colors.muted }}>
        Expo shell ready. Phase 1 builds Discover: search, filters, Guided Discovery.
      </Text>
    </View>
  );
}

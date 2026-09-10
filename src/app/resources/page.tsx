import PageLayout from "@/components/layout/PageLayout";
import AudioPlayerProvider from "@/components/audio/AudioPlayerProvider";
import AudioPlayerBar from "@/components/audio/AudioPlayerBar";
import ResourcesPage from "@/components/resources/ResourcesPage";

export default function ResourcesRoute() {
  return (
    <PageLayout theme="light">
      <AudioPlayerProvider>
        <ResourcesPage />
        <AudioPlayerBar />
      </AudioPlayerProvider>
    </PageLayout>
  );
}
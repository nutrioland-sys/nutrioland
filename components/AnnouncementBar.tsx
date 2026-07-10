import type { AnnouncementSettings } from "@/lib/types";

export default function AnnouncementBar({ settings }: { settings: AnnouncementSettings }) {
  if (!settings.enabled || settings.messages.length === 0) {
    return null;
  }

  const track = settings.messages.join("   •   ");

  return (
    <div className="overflow-hidden bg-accent py-2 text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <span className="px-4 text-sm font-semibold">{track}</span>
        <span className="px-4 text-sm font-semibold" aria-hidden="true">
          {track}
        </span>
      </div>
    </div>
  );
}

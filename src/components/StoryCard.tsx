import type { CSSProperties } from "react";
import {
  Activity,
  BadgeCheck,
  DropletOff,
  Flame,
  Heart,
  MapPin,
  MessageCircle,
  Repeat2,
  Sun,
  Waves,
  Wind,
} from "lucide-react";
import { HAZARDS, type HazardKey, type Story } from "@/lib/stories";

const HAZARD_ICONS = {
  flood: Waves,
  cyclone: Wind,
  heatwave: Sun,
  earthquake: Activity,
  drought: DropletOff,
  wildfire: Flame,
} satisfies Record<HazardKey, typeof Waves>;

const AVATAR_TONES = [
  ["#254b3d", "#4b806b"],
  ["#542d24", "#96553f"],
  ["#283b5c", "#4b6a96"],
  ["#57441f", "#8f7139"],
  ["#432a40", "#7b4b70"],
  ["#173d40", "#327274"],
  ["#572c1f", "#8c4c37"],
  ["#3b4224", "#70783f"],
  ["#372b53", "#66528d"],
  ["#49252b", "#8a4d56"],
];

function hashCode(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function initialsFor(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatCount(value: number) {
  if (value >= 10_000) return `${Math.round(value / 1_000)}k`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

function relativeTime(createdAt?: number, fallback = "now") {
  if (!createdAt) return fallback;

  const minutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60_000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
}

type StoryCardProps = {
  story: Story;
};

export function StoryCard({ story }: StoryCardProps) {
  const hazard = HAZARDS[story.hazard];
  const HazardIcon = HAZARD_ICONS[story.hazard];
  const tone = AVATAR_TONES[hashCode(story.id) % AVATAR_TONES.length];

  const style = {
    "--hazard": hazard.color,
    "--hazard-tint": hazard.tint,
    "--hazard-ink": hazard.ink,
    "--avatar-from": tone[0],
    "--avatar-to": tone[1],
  } as CSSProperties;

  return (
    <article
      className="storyCard"
      style={style}
      aria-label={`Field note by ${story.name}`}
    >
      <div className="cardTop">
        <div className="avatar" aria-hidden="true">
          {initialsFor(story.name)}
        </div>
        <div className="identity">
          <div className="nameRow">
            <span className="personName">{story.name}</span>
            {story.verified ? (
              <span className="verifiedBadge" title="Verified contributor">
                <BadgeCheck size={14} strokeWidth={2.3} aria-hidden="true" />
              </span>
            ) : null}
            {story.isLocal ? <span className="localBadge">New</span> : null}
          </div>
          <div className="handleLine">
            <span>{story.handle}</span>
            <span className="metaDot" aria-hidden="true" />
            <span>{relativeTime(story.createdAt, story.time)}</span>
          </div>
        </div>
      </div>

      <div className="fieldLine">
        <span className="fieldRole">{story.role}</span>
        <span className="metaDot" aria-hidden="true" />
        <span className="fieldLocation">
          <MapPin size={9} strokeWidth={2.1} aria-hidden="true" />
          {story.location}
        </span>
        <span className="hazardPill">
          <HazardIcon size={9} strokeWidth={2.4} aria-hidden="true" />
          {hazard.label}
        </span>
      </div>

      <p className="cardBody">{story.body}</p>

      <div className="cardFooter">
        <span className="hashtag">{story.hashtag}</span>
        <div className="engagement" aria-label="Engagement">
          <span title={`${story.replies} replies`}>
            <MessageCircle size={10} strokeWidth={2} aria-hidden="true" />
            {formatCount(story.replies)}
          </span>
          <span title={`${story.reposts} reposts`}>
            <Repeat2 size={11} strokeWidth={2} aria-hidden="true" />
            {formatCount(story.reposts)}
          </span>
          <span title={`${story.likes} likes`}>
            <Heart size={10} strokeWidth={2} aria-hidden="true" />
            {formatCount(story.likes)}
          </span>
        </div>
      </div>
    </article>
  );
}

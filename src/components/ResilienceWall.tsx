"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { SEED_STORIES } from "@/lib/stories";
import { StoryCard } from "@/components/StoryCard";

const COPIES = [0, 1];

const COLUMNS = [
  { direction: "down" as const, duration: 720 },
  { direction: "up" as const, duration: 640 },
  { direction: "down" as const, duration: 780 },
];

const LANES = COLUMNS.map((column, laneIndex) => ({
  ...column,
  stories: SEED_STORIES.filter((_, index) => index % 3 === laneIndex),
}));

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

export function ResilienceWall() {
  const pageRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    const doc = document as FullscreenDocument;
    const page = pageRef.current as FullscreenElement | null;

    try {
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
        setIsFullscreen(false);
        return;
      }

      if (page?.requestFullscreen) {
        await page.requestFullscreen();
        setIsFullscreen(true);
      } else if (page?.webkitRequestFullscreen) {
        await page.webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } catch {
      // The wall keeps running if the browser blocks fullscreen.
    }
  }, []);

  useEffect(() => {
    const doc = document as FullscreenDocument;

    const syncFullscreen = () => {
      setIsFullscreen(
        Boolean(doc.fullscreenElement || doc.webkitFullscreenElement),
      );
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("webkitfullscreenchange", syncFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("webkitfullscreenchange", syncFullscreen);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen]);

  return (
    <main
      ref={pageRef}
      className="wallPage wallPage--bare"
      aria-label="Gujarat disaster management resilience wall"
    >
      <div className="wallGrid wallGrid--bare">
        {LANES.map((lane, laneIndex) => (
          <div className="lane lane--bare" key={laneIndex}>
            <div
              className="marquee"
              role="region"
              aria-label={`Stories scrolling ${lane.direction === "down" ? "top to bottom" : "bottom to top"}`}
            >
              <div
                className={`marqueeTrack marqueeTrack--${lane.direction}`}
                style={{ "--duration": `${lane.duration}s` } as CSSProperties}
              >
                {COPIES.map((copy) => (
                  <div
                    className="marqueeGroup"
                    key={copy}
                    aria-hidden={copy > 0 ? true : undefined}
                  >
                    {lane.stories.map((story) => (
                      <StoryCard key={`${story.id}-${copy}`} story={story} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="bareFullscreen"
        onClick={() => void toggleFullscreen()}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-pressed={isFullscreen}
        title={`${isFullscreen ? "Exit" : "Enter"} fullscreen (F)`}
      >
        {isFullscreen ? (
          <Minimize2 size={17} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Maximize2 size={17} strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </main>
  );
}

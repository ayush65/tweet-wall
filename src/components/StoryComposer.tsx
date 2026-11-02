"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ChevronDown, Lock, X } from "lucide-react";
import { HAZARDS, HAZARD_ORDER, type HazardKey } from "@/lib/stories";

export type StoryDraft = {
  name: string;
  location: string;
  role: string;
  hazard: HazardKey;
  body: string;
  hashtag: string;
};

type StoryComposerProps = {
  onClose: () => void;
  onAdd: (draft: StoryDraft) => void;
};

const MAX_BODY = 480;

export function StoryComposer({ onClose, onAdd }: StoryComposerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [hazard, setHazard] = useState<HazardKey>("flood");
  const [body, setBody] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 40);

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (body.trim().length < 20) {
      setError("Give us a little more — at least 20 characters.");
      bodyRef.current?.focus();
      return;
    }

    setError(null);
    onAdd({
      name: name.trim(),
      location: location.trim(),
      role: role.trim(),
      hazard,
      body: body.trim(),
      hashtag: hashtag.trim(),
    });
  }

  return (
    <div
      className="modalBackdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="composer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
        aria-describedby="composer-description"
      >
        <div className="composerTop">
          <span className="composerEyebrow">Add to the live wall</span>
          <button
            type="button"
            className="composerClose"
            onClick={onClose}
            aria-label="Close the story form"
          >
            <X size={17} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <h2 id="composer-title" className="composerTitle">
          Share a field note.
        </h2>
        <p id="composer-description" className="composerIntro">
          What did you see, learn, or survive? Keep it first-hand, specific, and
          useful to someone facing the same hazard.
        </p>

        <form className="composerForm" onSubmit={submit}>
          <div className="formGrid">
            <label className="formField">
              <span className="fieldLabel">Your name</span>
              <input
                ref={nameRef}
                className="textInput"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Meera Shah"
                autoComplete="name"
                maxLength={40}
                required
              />
            </label>

            <label className="formField">
              <span className="fieldLabel">Location</span>
              <input
                className="textInput"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Vadodara"
                autoComplete="address-level2"
                maxLength={40}
              />
            </label>
          </div>

          <div className="formGrid">
            <label className="formField">
              <span className="fieldLabel">Role or connection</span>
              <input
                className="textInput"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. Community volunteer"
                maxLength={40}
              />
            </label>

            <label className="formField">
              <span className="fieldLabel">Hazard</span>
              <span className="selectWrap">
                <select
                  className="selectInput"
                  value={hazard}
                  onChange={(event) => setHazard(event.target.value as HazardKey)}
                >
                  {HAZARD_ORDER.map((key) => (
                    <option key={key} value={key}>
                      {HAZARDS[key].label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="selectIcon"
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </label>
          </div>

          <label className="formField">
            <span className="fieldLabel">
              Your experience
              <span className="counter">
                {body.length}/{MAX_BODY}
              </span>
            </span>
            <textarea
              ref={bodyRef}
              className="textArea"
              value={body}
              onChange={(event) => {
                setBody(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Tell us what happened, what you learned, or what you wish someone had told you sooner."
              maxLength={MAX_BODY}
              rows={4}
              required
            />
          </label>

          <label className="formField">
            <span className="fieldLabel">
              Hashtag
              <span className="optional">optional</span>
            </span>
            <span className="tagInputWrap">
              <span className="tagPrefix" aria-hidden="true">
                #
              </span>
              <input
                className="textInput tagInput"
                value={hashtag}
                onChange={(event) =>
                  setHashtag(
                    event.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 28),
                  )
                }
                placeholder="YourThread"
                maxLength={28}
                aria-describedby="hashtag-hint"
              />
            </span>
            <span id="hashtag-hint" className="fieldHint">
              Every note gets its own thread. If your tag is already on the wall,
              we will add a number to keep them all unique.
            </span>
          </label>

          {error ? (
            <p className="formError" role="alert">
              {error}
            </p>
          ) : null}

          <div className="composerBottom">
            <span className="privacyNote">
              <Lock size={11} strokeWidth={2} aria-hidden="true" />
              Saved in this browser only. This is a demonstration wall.
            </span>
            <div className="formActions">
              <button
                type="button"
                className="button button--ghost"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="button button--submit">
                Put it on the wall
                <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

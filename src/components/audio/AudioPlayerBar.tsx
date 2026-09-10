"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { useAudioPlayer } from "./AudioPlayerProvider";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function AudioPlayerBar() {
  const {
    currentItem,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    previous,
    next,
    togglePlay,
    skipBackward,
    skipForward,
    seek,
    setVolume,
    toggleMute,
    download,
    stop,
    hasPrevious,
    hasNext,
  } = useAudioPlayer();

  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const progressSliderRef = useRef<HTMLDivElement>(null);
  const mobileProgressSliderRef = useRef<HTMLDivElement>(null);
  const desktopVolumeSliderRef = useRef<HTMLDivElement>(null);
  const mobileVolumeSliderRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------------ */
  /* Reset transient UI when track changes                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setIsVolumeOpen(false);
    setIsDownloading(false);
  }, [currentItem?.media.id]);

  /* ------------------------------------------------------------------------ */
  /* Thumbnail                                                                */
  /* ------------------------------------------------------------------------ */

  const thumbnailUrl = useMemo(() => {
    if (!currentItem) {
      return null;
    }

    return (
      currentItem.media.thumbnailUrl ??
      currentItem.resource.thumbnail?.url ??
      null
    );
  }, [currentItem]);

  /* ------------------------------------------------------------------------ */
  /* Progress                                                                 */
  /* ------------------------------------------------------------------------ */

  const progress =
    duration > 0
      ? Math.min(
          100,
          Math.max(0, (currentTime / duration) * 100),
        )
      : 0;

  /* ------------------------------------------------------------------------ */
  /* Volume                                                                   */
  /* ------------------------------------------------------------------------ */

  const effectiveVolume = isMuted
    ? 0
    : Math.min(1, Math.max(0, volume));

  const volumeProgress = effectiveVolume * 100;

  /* ------------------------------------------------------------------------ */
  /* Progress interaction                                                     */
  /* ------------------------------------------------------------------------ */

  const updateProgressFromPointer = (
    event: PointerEvent<HTMLDivElement>,
    slider: HTMLDivElement,
  ) => {
    if (!duration) {
      return;
    }

    const rect = slider.getBoundingClientRect();

    if (!rect.width) {
      return;
    }

    const relativeX = event.clientX - rect.left;

    const percentage = Math.min(
      1,
      Math.max(0, relativeX / rect.width),
    );

    seek(percentage * duration);
  };

  const handleProgressPointerDown = (
    event: PointerEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const slider = sliderRef.current;

    if (!slider || !duration) {
      return;
    }

    event.preventDefault();

    slider.setPointerCapture(event.pointerId);

    updateProgressFromPointer(event, slider);
  };

  const handleProgressPointerMove = (
    event: PointerEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const slider = sliderRef.current;

    if (!slider || !duration) {
      return;
    }

    if (!slider.hasPointerCapture(event.pointerId)) {
      return;
    }

    event.preventDefault();

    updateProgressFromPointer(event, slider);
  };

  const handleProgressPointerUp = (
    event: PointerEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    if (slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Progress keyboard interaction                                            */
  /* ------------------------------------------------------------------------ */

  const handleProgressKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (!duration) {
      return;
    }

    const step = Math.max(1, duration * 0.01);

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        seek(Math.max(0, currentTime - step));
        break;

      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        seek(Math.min(duration, currentTime + step));
        break;

      case "Home":
        event.preventDefault();
        seek(0);
        break;

      case "End":
        event.preventDefault();
        seek(duration);
        break;

      default:
        break;
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Volume interaction                                                        */
  /* ------------------------------------------------------------------------ */

  const updateVolumeFromPointer = (
    event: PointerEvent<HTMLDivElement>,
    slider: HTMLDivElement,
  ) => {
    const rect = slider.getBoundingClientRect();

    if (!rect.height) {
      return;
    }

    const relativeY = event.clientY - rect.top;

    const percentage = Math.min(
      1,
      Math.max(0, 1 - relativeY / rect.height),
    );

    setVolume(percentage);
  };

  const handleVolumePointerDown = (
    event: PointerEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    event.preventDefault();

    slider.setPointerCapture(event.pointerId);

    updateVolumeFromPointer(event, slider);
  };

  const handleVolumePointerMove = (
    event: PointerEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    if (!slider.hasPointerCapture(event.pointerId)) {
      return;
    }

    event.preventDefault();

    updateVolumeFromPointer(event, slider);
  };

  const handleVolumePointerUp = (
    event: PointerEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    if (slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Volume keyboard interaction                                               */
  /* ------------------------------------------------------------------------ */

  const handleVolumeKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    const step = 0.05;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowLeft":
        event.preventDefault();
        setVolume(
          Math.max(0, effectiveVolume - step),
        );
        break;

      case "ArrowUp":
      case "ArrowRight":
        event.preventDefault();
        setVolume(
          Math.min(1, effectiveVolume + step),
        );
        break;

      case "Home":
        event.preventDefault();
        setVolume(0);
        break;

      case "End":
        event.preventDefault();
        setVolume(1);
        break;

      default:
        break;
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Download                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleDownload = async () => {
    if (
      isDownloading ||
      !currentItem?.media.url
    ) {
      return;
    }

    try {
      setIsDownloading(true);

      await download();
    } catch (error) {
      console.error(
        "Failed to download audio:",
        error,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Nothing playing                                                           */
  /* ------------------------------------------------------------------------ */

  if (!currentItem) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* Shared button styles                                                      */
  /* ------------------------------------------------------------------------ */

  const desktopIconButton = [
    "group",
    "relative",
    "flex",
    "h-9",
    "w-9",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-full",
    "text-charcoal/55",
    "transition-all",
    "duration-300",
    "ease-out",
    "hover:-translate-y-0.5",
    "hover:bg-blue-soft/[0.10]",
    "hover:text-blue-deep",
    "hover:shadow-[0_6px_18px_rgba(36,90,150,0.12)]",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue/[0.35]",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-ivory",
    "disabled:pointer-events-none",
    "disabled:opacity-25",
  ].join(" ");

  const mobileIconButton = [
    "group",
    "relative",
    "flex",
    "h-11",
    "w-11",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-full",
    "text-charcoal/55",
    "transition-all",
    "duration-300",
    "ease-out",
    "active:scale-95",
    "hover:-translate-y-0.5",
    "hover:bg-blue-soft/[0.10]",
    "hover:text-blue-deep",
    "hover:shadow-[0_6px_18px_rgba(36,90,150,0.12)]",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue/[0.35]",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-ivory",
    "disabled:pointer-events-none",
    "disabled:opacity-25",
  ].join(" ");

  const primaryPlayButton = [
    "relative",
    "flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-full",
    "bg-gold",
    "text-charcoal",
    "transition-all",
    "duration-300",
    "ease-out",
    "hover:-translate-y-0.5",
    "hover:bg-gold-light",
    "hover:shadow-[0_8px_24px_rgba(36,90,150,0.18),0_0_0_5px_rgba(59,130,208,0.10)]",
    "active:scale-95",
    "disabled:opacity-60",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue/[0.40]",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-ivory",
    "before:pointer-events-none",
    "before:absolute",
    "before:inset-[-4px]",
    "before:rounded-full",
    "before:border",
    "before:border-blue/[0.12]",
    "before:opacity-0",
    "before:transition-all",
    "before:duration-500",
    "hover:before:scale-110",
    "hover:before:opacity-100",
  ].join(" ");

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] overflow-visible">
      {/* ================================================================== */}
      {/* GLASS PLAYER                                                        */}
      {/* ================================================================== */}

      <div
        className={[
          "relative",
          "overflow-visible",
          "border-t",
          "border-white/[0.55]",
          "bg-ivory/[0.86]",
          "shadow-[0_-20px_70px_rgba(36,90,150,0.12)]",
          "backdrop-blur-2xl",
          "backdrop-saturate-150",
        ].join(" ")}
      >
        {/* ================================================================== */}
        {/* BLUE / GOLD / IVORY ATMOSPHERE                                     */}
        {/* ================================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Primary blue atmosphere */}

          <div
            className={[
              "absolute",
              "-left-24",
              "-top-32",
              "h-72",
              "w-[26rem]",
              "rounded-full",
              "bg-blue-soft/[0.16]",
              "blur-3xl",
            ].join(" ")}
          />

          {/* Soft pale blue wash */}

          <div
            className={[
              "absolute",
              "left-[30%]",
              "-bottom-32",
              "h-56",
              "w-[32rem]",
              "rounded-full",
              "bg-blue-light/[0.10]",
              "blur-3xl",
            ].join(" ")}
          />

          {/* Gold counterweight */}

          <div
            className={[
              "absolute",
              "-right-24",
              "-top-28",
              "h-64",
              "w-72",
              "rounded-full",
              "bg-gold/[0.10]",
              "blur-3xl",
            ].join(" ")}
          />

          {/* Blue gradient sweep */}

          <div
            className={[
              "absolute",
              "inset-y-0",
              "left-[12%]",
              "w-[46%]",
              "bg-gradient-to-r",
              "from-blue-pale/[0.22]",
              "via-blue-soft/[0.07]",
              "to-transparent",
              "blur-2xl",
            ].join(" ")}
          />

          {/* Fine blue architectural line */}

          <div
            className={[
              "absolute",
              "right-[18%]",
              "top-0",
              "h-px",
              "w-28",
              "bg-blue/[0.34]",
            ].join(" ")}
          />

          {/* Subtle blue ring */}

          <div
            className={[
              "absolute",
              "right-[19%]",
              "-top-8",
              "h-20",
              "w-20",
              "rounded-full",
              "border",
              "border-blue/[0.12]",
            ].join(" ")}
          />

          {/* Ivory glass haze */}

          <div className="absolute inset-0 bg-ivory/[0.34]" />
        </div>

        {/* Fine top highlight */}

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute",
            "inset-x-0",
            "top-0",
            "z-20",
            "h-px",
            "bg-white/[0.80]",
          ].join(" ")}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8">
          {/* ================================================================= */}
          {/* DESKTOP / TABLET PROGRESS                                         */}
          {/* ================================================================= */}

          <div className="hidden pt-5 md:block">
            <div
              ref={progressSliderRef}
              role="slider"
              tabIndex={duration ? 0 : -1}
              aria-label="Audio progress"
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={Math.min(
                duration || 0,
                Math.max(0, currentTime),
              )}
              aria-valuetext={`${formatTime(
                currentTime,
              )} of ${formatTime(duration)}`}
              onKeyDown={handleProgressKeyDown}
              onPointerDown={(event) =>
                handleProgressPointerDown(
                  event,
                  progressSliderRef,
                )
              }
              onPointerMove={(event) =>
                handleProgressPointerMove(
                  event,
                  progressSliderRef,
                )
              }
              onPointerUp={(event) =>
                handleProgressPointerUp(
                  event,
                  progressSliderRef,
                )
              }
              onPointerCancel={(event) =>
                handleProgressPointerUp(
                  event,
                  progressSliderRef,
                )
              }
              className={[
                "relative",
                "h-4",
                "w-full",
                "touch-none",
                duration
                  ? "cursor-pointer"
                  : "cursor-default",
                "select-none",
                "outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-blue/[0.35]",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-ivory",
              ].join(" ")}
            >
              <div
                className={[
                  "pointer-events-none",
                  "absolute",
                  "inset-x-0",
                  "top-1/2",
                  "h-1",
                  "-translate-y-1/2",
                  "rounded-full",
                  "bg-charcoal/[0.10]",
                  "shadow-[inset_0_0_8px_rgba(36,90,150,0.10)]",
                ].join(" ")}
              />

              <div
                className={[
                  "pointer-events-none",
                  "absolute",
                  "left-0",
                  "top-1/2",
                  "h-1",
                  "-translate-y-1/2",
                  "rounded-full",
                  "bg-gold-light",
                  "transition-[width]",
                  "duration-100",
                  "shadow-[0_0_8px_rgba(201,180,125,0.22),0_0_10px_rgba(59,130,208,0.08)]",
                ].join(" ")}
                style={{
                  width: `${progress}%`,
                }}
              />

              <div
                className={[
                  "pointer-events-none",
                  "absolute",
                  "top-1/2",
                  "z-[12]",
                  "h-3",
                  "w-3",
                  "-translate-x-1/2",
                  "-translate-y-1/2",
                  "rounded-full",
                  "border",
                  "border-white",
                  "bg-gold-light",
                  "shadow-[0_1px_8px_rgba(0,0,0,0.16),0_0_0_3px_rgba(59,130,208,0.10)]",
                ].join(" ")}
                style={{
                  left: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* ================================================================= */}
          {/* DESKTOP / TABLET MAIN PLAYER                                      */}
          {/* ================================================================= */}

          <div
            className={[
              "hidden",
              "min-h-[76px]",
              "items-center",
              "gap-3",
              "py-2.5",
              "md:flex",
              "sm:gap-4",
              "sm:py-3",
            ].join(" ")}
          >
            {/* Thumbnail */}

            <div
              className={[
                "relative",
                "h-11",
                "w-11",
                "shrink-0",
                "overflow-hidden",
                "rounded-xl",
                "border",
                "border-white/[0.70]",
                "bg-white/[0.42]",
                "ring-1",
                "ring-blue/[0.14]",
                "shadow-[0_4px_16px_rgba(36,90,150,0.12)]",
                "backdrop-blur-md",
              ].join(" ")}
            >
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={[
                    "absolute",
                    "inset-0",
                    "bg-gradient-to-br",
                    "from-blue-soft/[0.28]",
                    "via-blue-pale/[0.60]",
                    "to-gold/[0.20]",
                  ].join(" ")}
                />
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-white/[0.10]"
              />

              <div
                aria-hidden="true"
                className={[
                  "absolute",
                  "inset-y-0",
                  "right-0",
                  "w-px",
                  "bg-blue/[0.42]",
                ].join(" ")}
              />
            </div>

            {/* Track information */}

            <div
              className={[
                "min-w-0",
                "max-w-[160px]",
                "shrink",
                "sm:max-w-[230px]",
                "lg:max-w-[300px]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-px w-4 shrink-0 bg-blue/[0.48]"
                />

                <p
                  className={[
                    "truncate",
                    "text-[9px]",
                    "font-semibold",
                    "uppercase",
                    "tracking-[0.14em]",
                    "text-bronze",
                  ].join(" ")}
                >
                  Now Playing
                </p>
              </div>

              <p
                className={[
                  "mt-0.5",
                  "truncate",
                  "text-sm",
                  "font-medium",
                  "text-charcoal",
                  "sm:text-[15px]",
                ].join(" ")}
                title={currentItem.resource.title}
              >
                {currentItem.resource.title}
              </p>
            </div>

            {/* Desktop controls */}

            <div
              className={[
                "flex",
                "shrink-0",
                "items-center",
                "gap-1",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => {
                  void previous();
                }}
                disabled={!hasPrevious}
                aria-label="Previous audio"
                title="Previous audio"
                className={desktopIconButton}
              >
                <ChevronLeft
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                  strokeWidth={1.7}
                />
              </button>

              <button
                type="button"
                onClick={() => skipBackward(10)}
                aria-label="Rewind 10 seconds"
                title="Rewind 10 seconds"
                className={[
                  desktopIconButton,
                  "relative",
                ].join(" ")}
              >
                <RotateCcw
                  className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45"
                  strokeWidth={1.7}
                />

                <span
                  className={[
                    "absolute",
                    "text-[7px]",
                    "font-semibold",
                    "text-charcoal/65",
                    "transition-colors",
                    "duration-300",
                    "group-hover:text-blue-deep",
                  ].join(" ")}
                >
                  10
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  void togglePlay();
                }}
                disabled={isLoading}
                aria-label={
                  isPlaying
                    ? "Pause audio"
                    : "Play audio"
                }
                title={
                  isPlaying
                    ? "Pause"
                    : "Play"
                }
                className={[
                  primaryPlayButton,
                  "h-10",
                  "w-10",
                  isPlaying
                    ? "shadow-[0_6px_20px_rgba(36,90,150,0.16),0_0_0_5px_rgba(59,130,208,0.08)]"
                    : "shadow-[0_4px_18px_rgba(36,90,150,0.12)]",
                ].join(" ")}
              >
                {isLoading ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                  />
                ) : isPlaying ? (
                  <Pause
                    className="h-4 w-4"
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    className="ml-0.5 h-4 w-4"
                    fill="currentColor"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => skipForward(10)}
                aria-label="Forward 10 seconds"
                title="Forward 10 seconds"
                className={[
                  desktopIconButton,
                  "relative",
                ].join(" ")}
              >
                <RotateCw
                  className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45"
                  strokeWidth={1.7}
                />

                <span
                  className={[
                    "absolute",
                    "text-[7px]",
                    "font-semibold",
                    "text-charcoal/65",
                    "transition-colors",
                    "duration-300",
                    "group-hover:text-blue-deep",
                  ].join(" ")}
                >
                  10
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  void next();
                }}
                disabled={!hasNext}
                aria-label="Next audio"
                title="Next audio"
                className={desktopIconButton}
              >
                <ChevronRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.7}
                />
              </button>
            </div>

            {/* Desktop time */}

            <div
              className={[
                "ml-auto",
                "flex",
                "shrink-0",
                "items-center",
                "gap-1.5",
                "text-[10px]",
                "tabular-nums",
                "text-charcoal/45",
              ].join(" ")}
            >
              <span>
                {formatTime(currentTime)}
              </span>

              <span className="text-charcoal/20">
                /
              </span>

              <span>
                {formatTime(duration)}
              </span>
            </div>

            {/* Desktop volume */}

            <div className="relative z-30 shrink-0">
              {isVolumeOpen && (
                <div
                  className={[
                    "absolute",
                    "bottom-[calc(100%+0.75rem)]",
                    "left-1/2",
                    "z-[80]",
                    "flex",
                    "h-28",
                    "w-12",
                    "-translate-x-1/2",
                    "items-center",
                    "justify-center",
                    "rounded-2xl",
                    "border",
                    "border-white/[0.70]",
                    "bg-ivory/[0.88]",
                    "px-3",
                    "py-3",
                    "shadow-[0_18px_50px_rgba(36,90,150,0.16)]",
                    "ring-1",
                    "ring-blue/[0.10]",
                    "backdrop-blur-2xl",
                    "backdrop-saturate-150",
                  ].join(" ")}
                >
                  <div
                    ref={desktopVolumeSliderRef}
                    role="slider"
                    tabIndex={0}
                    aria-label="Volume"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(
                      effectiveVolume * 100,
                    )}
                    aria-valuetext={`${Math.round(
                      effectiveVolume * 100,
                    )}%`}
                    onKeyDown={
                      handleVolumeKeyDown
                    }
                    onPointerDown={(event) =>
                      handleVolumePointerDown(
                        event,
                        desktopVolumeSliderRef,
                      )
                    }
                    onPointerMove={(event) =>
                      handleVolumePointerMove(
                        event,
                        desktopVolumeSliderRef,
                      )
                    }
                    onPointerUp={(event) =>
                      handleVolumePointerUp(
                        event,
                        desktopVolumeSliderRef,
                      )
                    }
                    onPointerCancel={(event) =>
                      handleVolumePointerUp(
                        event,
                        desktopVolumeSliderRef,
                      )
                    }
                    className={[
                      "relative",
                      "h-20",
                      "w-5",
                      "touch-none",
                      "cursor-pointer",
                      "select-none",
                      "outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-blue/[0.35]",
                      "focus-visible:ring-offset-2",
                      "focus-visible:ring-offset-ivory",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "pointer-events-none",
                        "absolute",
                        "left-1/2",
                        "top-1/2",
                        "h-20",
                        "w-1.5",
                        "-translate-x-1/2",
                        "-translate-y-1/2",
                        "rounded-full",
                        "bg-charcoal/[0.10]",
                      ].join(" ")}
                    />

                    <div
                      className={[
                        "pointer-events-none",
                        "absolute",
                        "bottom-0",
                        "left-1/2",
                        "w-1.5",
                        "-translate-x-1/2",
                        "rounded-full",
                        "bg-blue",
                        "shadow-[0_0_10px_rgba(59,130,208,0.20)]",
                      ].join(" ")}
                      style={{
                        height: `${volumeProgress}%`,
                      }}
                    />

                    <div
                      className={[
                        "pointer-events-none",
                        "absolute",
                        "left-1/2",
                        "z-[12]",
                        "h-3",
                        "w-3",
                        "-translate-x-1/2",
                        "translate-y-1/2",
                        "rounded-full",
                        "border",
                        "border-white",
                        "bg-blue",
                        "shadow-[0_2px_8px_rgba(36,90,150,0.18),0_0_0_3px_rgba(59,130,208,0.10)]",
                      ].join(" ")}
                      style={{
                        bottom: `${volumeProgress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setIsVolumeOpen(
                    (value) => !value,
                  )
                }
                aria-label="Volume"
                title="Volume"
                className={[
                  desktopIconButton,
                  isVolumeOpen
                    ? "bg-blue-soft/[0.12] text-blue-deep shadow-[0_6px_18px_rgba(36,90,150,0.12)]"
                    : "",
                ].join(" ")}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX
                    className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
                    strokeWidth={1.7}
                  />
                ) : (
                  <Volume2
                    className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
                    strokeWidth={1.7}
                  />
                )}
              </button>
            </div>

            {/* Desktop download */}

            <button
              type="button"
              onClick={() => {
                void handleDownload();
              }}
              disabled={isDownloading}
              aria-label="Download audio"
              title="Download audio"
              className={desktopIconButton}
            >
              {isDownloading ? (
                <Loader2
                  className="h-4 w-4 animate-spin"
                />
              ) : (
                <Download
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  strokeWidth={1.7}
                />
              )}
            </button>

            {/* Desktop close */}

            <button
              type="button"
              onClick={stop}
              aria-label="Close audio player"
              title="Close player"
              className={[
                desktopIconButton,
                "text-charcoal/40",
              ].join(" ")}
            >
              <X
                className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                strokeWidth={1.7}
              />
            </button>
          </div>

          {/* ================================================================= */}
          {/* MOBILE PLAYER                                                      */}
          {/* ================================================================= */}

          <div className="md:hidden">
            {/* Mobile track header */}

            <div
              className={[
                "flex",
                "min-w-0",
                "items-center",
                "gap-3",
                "py-2.5",
              ].join(" ")}
            >
              {/* Mobile thumbnail */}

              <div
                className={[
                  "relative",
                  "h-11",
                  "w-11",
                  "shrink-0",
                  "overflow-hidden",
                  "rounded-xl",
                  "border",
                  "border-white/[0.70]",
                  "bg-white/[0.42]",
                  "ring-1",
                  "ring-blue/[0.14]",
                  "shadow-[0_4px_14px_rgba(36,90,150,0.12)]",
                  "backdrop-blur-md",
                ].join(" ")}
              >
                {thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={[
                      "absolute",
                      "inset-0",
                      "bg-gradient-to-br",
                      "from-blue-soft/[0.28]",
                      "via-blue-pale/[0.60]",
                      "to-gold/[0.20]",
                    ].join(" ")}
                  />
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-white/[0.10]"
                />

                <div
                  aria-hidden="true"
                  className={[
                    "absolute",
                    "inset-y-0",
                    "right-0",
                    "w-px",
                    "bg-blue/[0.42]",
                  ].join(" ")}
                />
              </div>

              {/* Track information */}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-px w-4 shrink-0 bg-blue/[0.48]"
                  />

                  <p
                    className={[
                      "truncate",
                      "text-[9px]",
                      "font-semibold",
                      "uppercase",
                      "tracking-[0.12em]",
                      "text-bronze",
                    ].join(" ")}
                  >
                    Now Playing
                  </p>
                </div>

                <p
                  className={[
                    "mt-0.5",
                    "truncate",
                    "text-[13px]",
                    "font-medium",
                    "leading-5",
                    "text-charcoal",
                  ].join(" ")}
                  title={currentItem.resource.title}
                >
                  {currentItem.resource.title}
                </p>
              </div>

              {/* Close */}

              <button
                type="button"
                onClick={stop}
                aria-label="Close audio player"
                title="Close player"
                className={[
                  mobileIconButton,
                  "text-charcoal/40",
                ].join(" ")}
              >
                <X
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                  strokeWidth={1.7}
                />
              </button>
            </div>

            {/* Mobile progress + time */}

            <div className="pb-1 pt-1">
              <div
                ref={mobileProgressSliderRef}
                role="slider"
                tabIndex={duration ? 0 : -1}
                aria-label="Audio progress"
                aria-valuemin={0}
                aria-valuemax={duration || 0}
                aria-valuenow={Math.min(
                  duration || 0,
                  Math.max(0, currentTime),
                )}
                aria-valuetext={`${formatTime(
                  currentTime,
                )} of ${formatTime(duration)}`}
                onKeyDown={handleProgressKeyDown}
                onPointerDown={(event) =>
                  handleProgressPointerDown(
                    event,
                    mobileProgressSliderRef,
                  )
                }
                onPointerMove={(event) =>
                  handleProgressPointerMove(
                    event,
                    mobileProgressSliderRef,
                  )
                }
                onPointerUp={(event) =>
                  handleProgressPointerUp(
                    event,
                    mobileProgressSliderRef,
                  )
                }
                onPointerCancel={(event) =>
                  handleProgressPointerUp(
                    event,
                    mobileProgressSliderRef,
                  )
                }
                className={[
                  "relative",
                  "h-4",
                  "w-full",
                  "touch-none",
                  duration
                    ? "cursor-pointer"
                    : "cursor-default",
                  "select-none",
                  "outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-blue/[0.35]",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-ivory",
                ].join(" ")}
              >
                <div
                  className={[
                    "pointer-events-none",
                    "absolute",
                    "inset-x-0",
                    "top-1/2",
                    "h-1",
                    "-translate-y-1/2",
                    "rounded-full",
                    "bg-charcoal/[0.10]",
                    "shadow-[inset_0_0_8px_rgba(36,90,150,0.10)]",
                  ].join(" ")}
                />

                <div
                  className={[
                    "pointer-events-none",
                    "absolute",
                    "left-0",
                    "top-1/2",
                    "h-1",
                    "-translate-y-1/2",
                    "rounded-full",
                    "bg-gold-light",
                    "transition-[width]",
                    "duration-100",
                    "shadow-[0_0_8px_rgba(201,180,125,0.22),0_0_10px_rgba(59,130,208,0.08)]",
                  ].join(" ")}
                  style={{
                    width: `${progress}%`,
                  }}
                />

                <div
                  className={[
                    "pointer-events-none",
                    "absolute",
                    "top-1/2",
                    "z-[12]",
                    "h-3",
                    "w-3",
                    "-translate-x-1/2",
                    "-translate-y-1/2",
                    "rounded-full",
                    "border",
                    "border-white",
                    "bg-gold-light",
                    "shadow-[0_1px_8px_rgba(0,0,0,0.16),0_0_0_3px_rgba(59,130,208,0.10)]",
                  ].join(" ")}
                  style={{
                    left: `${progress}%`,
                  }}
                />
              </div>

              {/* Duration timer */}

              <div
                className={[
                  "mt-1",
                  "flex",
                  "items-center",
                  "justify-between",
                  "px-0.5",
                  "text-[9px]",
                  "tabular-nums",
                  "text-charcoal/40",
                ].join(" ")}
              >
                <span>
                  {formatTime(currentTime)}
                </span>

                <span>
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Mobile controls */}

            <div
              className={[
                "flex",
                "items-center",
                "justify-between",
                "py-2",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => {
                  void previous();
                }}
                disabled={!hasPrevious}
                aria-label="Previous audio"
                title="Previous audio"
                className={mobileIconButton}
              >
                <ChevronLeft
                  className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-x-0.5"
                  strokeWidth={1.7}
                />
              </button>

              <button
                type="button"
                onClick={() => skipBackward(10)}
                aria-label="Rewind 10 seconds"
                title="Rewind 10 seconds"
                className={[
                  mobileIconButton,
                  "relative",
                ].join(" ")}
              >
                <RotateCcw
                  className="h-[17px] w-[17px] transition-transform duration-500 group-hover:-rotate-45"
                  strokeWidth={1.7}
                />

                <span
                  className={[
                    "absolute",
                    "text-[7px]",
                    "font-semibold",
                    "text-charcoal/65",
                    "transition-colors",
                    "duration-300",
                    "group-hover:text-blue-deep",
                  ].join(" ")}
                >
                  10
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  void togglePlay();
                }}
                disabled={isLoading}
                aria-label={
                  isPlaying
                    ? "Pause audio"
                    : "Play audio"
                }
                title={
                  isPlaying
                    ? "Pause"
                    : "Play"
                }
                className={[
                  primaryPlayButton,
                  "h-11",
                  "w-11",
                  isPlaying
                    ? "shadow-[0_6px_20px_rgba(36,90,150,0.16),0_0_0_5px_rgba(59,130,208,0.08)]"
                    : "shadow-[0_4px_18px_rgba(36,90,150,0.12)]",
                ].join(" ")}
              >
                {isLoading ? (
                  <Loader2
                    className="h-[17px] w-[17px] animate-spin"
                  />
                ) : isPlaying ? (
                  <Pause
                    className="h-[17px] w-[17px]"
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    className="ml-0.5 h-[17px] w-[17px]"
                    fill="currentColor"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => skipForward(10)}
                aria-label="Forward 10 seconds"
                title="Forward 10 seconds"
                className={[
                  mobileIconButton,
                  "relative",
                ].join(" ")}
              >
                <RotateCw
                  className="h-[17px] w-[17px] transition-transform duration-500 group-hover:rotate-45"
                  strokeWidth={1.7}
                />

                <span
                  className={[
                    "absolute",
                    "text-[7px]",
                    "font-semibold",
                    "text-charcoal/65",
                    "transition-colors",
                    "duration-300",
                    "group-hover:text-blue-deep",
                  ].join(" ")}
                >
                  10
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  void next();
                }}
                disabled={!hasNext}
                aria-label="Next audio"
                title="Next audio"
                className={mobileIconButton}
              >
                <ChevronRight
                  className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.7}
                />
              </button>

              {/* Mobile volume */}

              <div className="relative z-30">
                {isVolumeOpen && (
                  <div
                    className={[
                      "absolute",
                      "bottom-[calc(100%+0.75rem)]",
                      "right-0",
                      "z-[80]",
                      "flex",
                      "h-32",
                      "w-14",
                      "flex-col",
                      "items-center",
                      "justify-center",
                      "gap-2",
                      "rounded-2xl",
                      "border",
                      "border-white/[0.70]",
                      "bg-ivory/[0.90]",
                      "px-2",
                      "py-3",
                      "shadow-[0_18px_50px_rgba(36,90,150,0.16)]",
                      "ring-1",
                      "ring-blue/[0.10]",
                      "backdrop-blur-2xl",
                      "backdrop-saturate-150",
                    ].join(" ")}
                  >
                    {/* Mute */}

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={
                        isMuted
                          ? "Unmute audio"
                          : "Mute audio"
                      }
                      title={
                        isMuted
                          ? "Unmute"
                          : "Mute"
                      }
                      className={[
                        "group",
                        "flex",
                        "h-8",
                        "w-8",
                        "items-center",
                        "justify-center",
                        "rounded-full",
                        "text-charcoal/55",
                        "transition-all",
                        "duration-300",
                        "hover:bg-blue-soft/[0.10]",
                        "hover:text-blue-deep",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-blue/[0.35]",
                      ].join(" ")}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX
                          className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
                          strokeWidth={1.7}
                        />
                      ) : (
                        <Volume2
                          className="h-4 w-4 transition-transform duration-300 group-hover:scale-105"
                          strokeWidth={1.7}
                        />
                      )}
                    </button>

                    {/* Mobile volume slider */}

                    <div
                      ref={mobileVolumeSliderRef}
                      role="slider"
                      tabIndex={0}
                      aria-label="Volume"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(
                        effectiveVolume * 100,
                      )}
                      aria-valuetext={`${Math.round(
                        effectiveVolume * 100,
                      )}%`}
                      onKeyDown={
                        handleVolumeKeyDown
                      }
                      onPointerDown={(event) =>
                        handleVolumePointerDown(
                          event,
                          mobileVolumeSliderRef,
                        )
                      }
                      onPointerMove={(event) =>
                        handleVolumePointerMove(
                          event,
                          mobileVolumeSliderRef,
                        )
                      }
                      onPointerUp={(event) =>
                        handleVolumePointerUp(
                          event,
                          mobileVolumeSliderRef,
                        )
                      }
                      onPointerCancel={(event) =>
                        handleVolumePointerUp(
                          event,
                          mobileVolumeSliderRef,
                        )
                      }
                      className={[
                        "relative",
                        "h-20",
                        "w-5",
                        "touch-none",
                        "cursor-pointer",
                        "select-none",
                        "outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-blue/[0.35]",
                        "focus-visible:ring-offset-2",
                        "focus-visible:ring-offset-ivory",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "pointer-events-none",
                          "absolute",
                          "left-1/2",
                          "top-1/2",
                          "h-20",
                          "w-1.5",
                          "-translate-x-1/2",
                          "-translate-y-1/2",
                          "rounded-full",
                          "bg-charcoal/[0.10]",
                        ].join(" ")}
                      />

                      <div
                        className={[
                          "pointer-events-none",
                          "absolute",
                          "bottom-0",
                          "left-1/2",
                          "w-1.5",
                          "-translate-x-1/2",
                          "rounded-full",
                          "bg-blue",
                          "shadow-[0_0_10px_rgba(59,130,208,0.20)]",
                        ].join(" ")}
                        style={{
                          height: `${volumeProgress}%`,
                        }}
                      />

                      <div
                        className={[
                          "pointer-events-none",
                          "absolute",
                          "left-1/2",
                          "z-[12]",
                          "h-3",
                          "w-3",
                          "-translate-x-1/2",
                          "translate-y-1/2",
                          "rounded-full",
                          "border",
                          "border-white",
                          "bg-blue",
                          "shadow-[0_2px_8px_rgba(36,90,150,0.18),0_0_0_3px_rgba(59,130,208,0.10)]",
                        ].join(" ")}
                        style={{
                          bottom: `${volumeProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setIsVolumeOpen(
                      (value) => !value,
                    )
                  }
                  aria-label="Volume"
                  title="Volume"
                  className={[
                    mobileIconButton,
                    isVolumeOpen
                      ? "bg-blue-soft/[0.12] text-blue-deep shadow-[0_6px_18px_rgba(36,90,150,0.12)]"
                      : "",
                  ].join(" ")}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX
                      className="h-[17px] w-[17px] transition-transform duration-300 group-hover:scale-105"
                      strokeWidth={1.7}
                    />
                  ) : (
                    <Volume2
                      className="h-[17px] w-[17px] transition-transform duration-300 group-hover:scale-105"
                      strokeWidth={1.7}
                    />
                  )}
                </button>
              </div>

              {/* Download */}

              <button
                type="button"
                onClick={() => {
                  void handleDownload();
                }}
                disabled={isDownloading}
                aria-label="Download audio"
                title="Download audio"
                className={mobileIconButton}
              >
                {isDownloading ? (
                  <Loader2
                    className="h-[17px] w-[17px] animate-spin"
                  />
                ) : (
                  <Download
                    className="h-[17px] w-[17px] transition-transform duration-300 group-hover:translate-y-0.5"
                    strokeWidth={1.7}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

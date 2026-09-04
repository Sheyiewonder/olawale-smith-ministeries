"use client";

import {
  Download,
  ChevronDown,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface CustomAudioPlayerProps {
  src: string;
  title?: string | null;
  thumbnailUrl?: string | null;
  fallbackIcon?: ReactNode;
}

function getDownloadFilename(title?: string | null) {
  const sanitizedTitle = (title ?? "")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.+$/, "")
    .slice(0, 180);

  return `${sanitizedTitle || "audio"}.mp3`;
}

export default function CustomAudioPlayer({
  src,
  title,
  thumbnailUrl,
  fallbackIcon,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const titleRef = useRef<HTMLDivElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [titleScrollable, setTitleScrollable] =
    useState(false);

  const hasThumbnail = Boolean(thumbnailUrl);

  const mutedTextColor = hasThumbnail
    ? "text-ivory/65"
    : "text-charcoal/60";

  const borderColor = hasThumbnail
    ? "border-ivory/25"
    : "border-charcoal/15";

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener(
        "ended",
        handleEnded,
      );
    };
  }, []);

  useEffect(() => {
    const element = titleRef.current;

    if (!element) return;

    const checkOverflow = () => {
      setTitleScrollable(
        element.scrollWidth > element.clientWidth + 2,
      );
    };

    checkOverflow();

    const resizeObserver =
      new ResizeObserver(checkOverflow);

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [title]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch (error) {
      console.error(
        "Audio playback failed:",
        error,
      );

      setPlaying(false);
    }
  };

  const seekTo = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    seekTo(Number(event.target.value));
  };

  const handleVolume = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);

    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = value;
    setVolume(value);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      duration || Number.MAX_SAFE_INTEGER,
    );

    setCurrentTime(audio.currentTime);
  };

  const handlePlaybackRate = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const rate = Number(event.target.value);
    const audio = audioRef.current;

    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  async function downloadAudio() {
    if (!src || downloading) {
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(false);

      const response = await fetch(src, {
        method: "GET",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(
          `Unable to download audio (${response.status}).`,
        );
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error(
          "Downloaded audio is empty.",
        );
      }

      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = getDownloadFilename(title);
      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 2000);
    } catch (error) {
      console.error(
        "Audio download failed:",
        error,
      );

      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(
      seconds % 60,
    );

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-2xl border p-6 shadow-2xl sm:p-8 ${
        hasThumbnail
          ? "border-gold/20 bg-charcoal text-ivory"
          : "border-bronze/30 bg-ivory/70 text-charcoal backdrop-blur-xl"
      }`}
      style={
        thumbnailUrl
          ? {
              backgroundImage: `linear-gradient(rgba(20, 18, 16, 0.72), rgba(20, 18, 16, 0.88)), url(${thumbnailUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : {
              background: "rgba(245, 240, 230, 0.72)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }
      }
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(
            event.currentTarget.duration || 0,
          );
        }}
        onDurationChange={(event) => {
          setDuration(
            event.currentTarget.duration || 0,
          );
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(
            event.currentTarget.currentTime,
          );
        }}
      />

      {/* Audio icon */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-6 flex items-center justify-center sm:top-9 ${
          hasThumbnail
            ? "text-gold/80"
            : "text-bronze/55"
        }`}
      >
        {fallbackIcon || (
          <Volume2
            className="h-14 w-14 sm:h-20 sm:w-20 y-20"
            strokeWidth={0.8}
          />
        )}
      </div>

      <div
        className={`relative z-10 mx-auto w-full max-w-sm pb-1 text-center ${
          !thumbnailUrl
            ? "pt-20 sm:pt-24"
            : "pt-16 sm:pt-20"
        }`}
      >
        {/* Scrollable resource title */}
        <div
          ref={titleRef}
          className="group relative mx-auto w-full max-w-full overflow-hidden"
        >
          <div
            className={`inline-block whitespace-nowrap text-base font-semibold ${
              hasThumbnail
                ? "text-gold"
                : "text-charcoal"
            } ${
              titleScrollable
                ? "transition-transform duration-[5000ms] ease-linear group-hover:-translate-x-[calc(100%-100%)]"
                : ""
            }`}
          >
            {title || "Audio preview"}
          </div>
        </div>

        {downloadError && (
          <p className="mt-2 text-xs text-red-400">
            Unable to download audio. Please try again.
          </p>
        )}

        <div className="mt-5 flex items-center gap-3">
          {/* Progress */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            onInput={(event) =>
              seekTo(
                Number(
                  event.currentTarget.value,
                ),
              )
            }
            className="h-2 min-w-0 flex-1 cursor-pointer accent-bronze"
            aria-label="Playback progress"
          />

          {/* Volume */}
          <div className="relative shrink-0">
            {showVolume && (
              <div
                className="absolute bottom-full left-1/2 mb-3 flex h-24 -translate-x-1/2 items-center justify-center rounded-full border border-charcoal/10 bg-ivory px-2 py-3 shadow-xl"
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolume}
                  className="h-16 w-1 cursor-pointer [writing-mode:vertical-lr] [direction:rtl] accent-bronze"
                  aria-label="Volume"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setShowVolume((visible) => !visible)
              }
              className={`flex h-8 w-8 items-center justify-center rounded-full transition duration-200 hover:text-bronze ${mutedTextColor}`}
              aria-label={
                showVolume
                  ? "Hide volume control"
                  : "Show volume control"
              }
              title={
                showVolume
                  ? "Hide volume"
                  : "Volume"
              }
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4 text-bronze" />
              ) : (
                <Volume2 className="h-4 w-4 text-bronze" />
              )}
            </button>
          </div>
        </div>

        {/* Time */}
        <div
          className={`mt-1 flex justify-between text-[10px] ${mutedTextColor}`}
        >
          <span>
            {formatTime(currentTime)}
          </span>

          <span>
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {/* Playback speed */}
          <label
            className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border ${borderColor} text-[9px] font-semibold ${mutedTextColor}`}
          >
            <select
              value={playbackRate}
              onChange={handlePlaybackRate}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent text-center text-[9px] text-transparent outline-none"
              aria-label="Playback speed"
            >
              {[0.75, 1, 1.25, 1.5, 2].map(
                (rate) => (
                  <option
                    key={rate}
                    value={rate}
                    className="text-charcoal"
                  >
                    {rate}x
                  </option>
                ),
              )}
            </select>

            <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-0.5">
              <span>{playbackRate}x</span>

              <ChevronDown className="h-2.5 w-2.5" />
            </span>
          </label>

          {/* Rewind 10 seconds */}
          <button
            type="button"
            onClick={() => skip(-10)}
            className={`group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${borderColor} ${mutedTextColor} transition duration-300 hover:scale-110 hover:border-bronze hover:text-bronze`}
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw className="absolute h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />

            <span className="relative z-10 mt-px text-[6px] font-bold leading-none">
              10
            </span>
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bronze text-ivory shadow-lg shadow-bronze/30 transition duration-300 hover:scale-105 hover:bg-gold hover:text-charcoal"
            aria-label={
              playing
                ? "Pause audio"
                : "Play audio"
            }
          >
            {playing ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </button>

          {/* Forward 10 seconds */}
          <button
            type="button"
            onClick={() => skip(10)}
            className={`group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${borderColor} ${mutedTextColor} transition duration-300 hover:scale-110 hover:border-bronze hover:text-bronze`}
            aria-label="Forward 10 seconds"
          >
            <RotateCw className="absolute h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />

            <span className="relative z-10 mt-px text-[6px] font-bold leading-none">
              10
            </span>
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={downloadAudio}
            disabled={downloading}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${borderColor} ${mutedTextColor} transition hover:scale-110 hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100`}
            aria-label={
              downloading
                ? "Downloading audio"
                : "Download audio"
            }
            title={
              downloading
                ? "Downloading audio"
                : "Download audio"
            }
          >
            {downloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Download,
  ChevronDown,
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

export default function CustomAudioPlayer({
  src,
  title,
  thumbnailUrl,
  fallbackIcon,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

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

    audio.addEventListener(
      "ended",
      handleEnded,
    );

    return () => {
      audio.removeEventListener(
        "ended",
        handleEnded,
      );
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
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

  function downloadAudio() {
    const link = document.createElement("a");
    link.href = src;
    link.download = title || "audio";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
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
          setDuration(event.currentTarget.duration || 0);
        }}
        onDurationChange={(event) => {
          setDuration(event.currentTarget.duration || 0);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
      />

      {!thumbnailUrl && (
        <div className="pointer-events-none absolute inset-x-0 top-5 flex items-center justify-center text-bronze/45 sm:top-8">
          {fallbackIcon || <Volume2 className="h-16 w-16 sm:h-24 sm:w-24" strokeWidth={0.7} />}
        </div>
      )}

      <div className={`relative z-10 mx-auto w-full max-w-sm pb-1 text-center ${!thumbnailUrl ? "pt-20 sm:pt-24" : ""}`}>
        <p className={`truncate text-base font-semibold ${hasThumbnail ? "text-gold" : "text-charcoal"}`}>
          {title || "Audio preview"}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            onInput={(event) =>
              seekTo(Number(event.currentTarget.value))
            }
            className="h-2 min-w-0 flex-1 cursor-pointer accent-bronze"
            aria-label="Playback progress"
          />

          <div className={`flex shrink-0 flex-col items-center gap-1 ${mutedTextColor}`}>
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 text-bronze" />
            ) : (
              <Volume2 className="h-4 w-4 text-bronze" />
            )}

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolume}
              className="h-14 w-1 [writing-mode:vertical-lr] [direction:rtl] accent-bronze"
              aria-label="Volume"
            />
          </div>
        </div>

        <div className={`mt-1 flex justify-between text-[10px] ${mutedTextColor}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <label className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border ${borderColor} text-[9px] font-semibold ${mutedTextColor}`}>
            <select
              value={playbackRate}
              onChange={handlePlaybackRate}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent text-center text-[9px] text-transparent outline-none"
              aria-label="Playback speed"
            >
              {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <option key={rate} value={rate} className="text-charcoal">
                  {rate}x
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-0.5">
              <span>{playbackRate}x</span>
              <ChevronDown className="h-2.5 w-2.5" />
            </span>
          </label>

          <button
            type="button"
            onClick={() => skip(-10)}
            className={`group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${borderColor} ${mutedTextColor} transition duration-300 hover:scale-110 hover:border-bronze hover:text-bronze`}
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
            <span className="-ml-2 text-[7px] font-bold">10</span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bronze text-ivory shadow-lg shadow-bronze/30 transition duration-300 hover:scale-105 hover:bg-gold hover:text-charcoal"
            aria-label={
              playing ? "Pause audio" : "Play audio"
            }
          >
            {playing ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => skip(10)}
            className={`group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${borderColor} ${mutedTextColor} transition duration-300 hover:scale-110 hover:border-bronze hover:text-bronze`}
            aria-label="Forward 10 seconds"
          >
            <span className="-mr-2 text-[7px] font-bold">10</span>
            <RotateCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          </button>

          <button
            type="button"
            onClick={downloadAudio}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${borderColor} ${mutedTextColor} transition hover:scale-110 hover:border-bronze hover:text-bronze`}
            aria-label="Download audio"
            title="Download audio"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
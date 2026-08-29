"use client";

import {
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CustomAudioPlayerProps {
  src: string;
  title?: string | null;
  thumbnailUrl?: string | null;
}

export default function CustomAudioPlayer({
  src,
  title,
  thumbnailUrl,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate,
    );

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
    );

    audio.addEventListener(
      "ended",
      handleEnded,
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate,
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );

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

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);

    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
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
      className="relative w-full overflow-hidden rounded-2xl border bg-background p-5 shadow-sm"
      style={
        thumbnailUrl
          ? {
              backgroundImage: `linear-gradient(rgba(20, 18, 16, 0.72), rgba(20, 18, 16, 0.88)), url(${thumbnailUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
      />

      <div className="mb-4">
        <p className="text-sm font-medium">
          {title || "Audio preview"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Preview uploaded audio
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
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

        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />

          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {volume === 0 ? (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          )}

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolume}
            className="w-20"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
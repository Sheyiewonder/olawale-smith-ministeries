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
  useState,
} from "react";

import {
  useAudioPlayer,
} from "./AudioPlayerProvider";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const remainingSeconds =
    totalSeconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
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

  const [isVolumeOpen, setIsVolumeOpen] =
    useState(false);

  const [isDownloading, setIsDownloading] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Reset volume popup when track changes                                   */
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
          Math.max(
            0,
            (currentTime / duration) * 100,
          ),
        )
      : 0;

  /* ------------------------------------------------------------------------ */
  /* Volume                                                                   */
  /* ------------------------------------------------------------------------ */

  const effectiveVolume = isMuted
    ? 0
    : Math.min(
        1,
        Math.max(0, volume),
      );

  const volumeProgress =
    effectiveVolume * 100;

  /* ------------------------------------------------------------------------ */
  /* Download                                                                 */
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
    } finally {
      setIsDownloading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Nothing playing                                                          */
  /* ------------------------------------------------------------------------ */

  if (!currentItem) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* Shared mobile button styles                                              */
  /* ------------------------------------------------------------------------ */

  const mobileIconButton = `
    flex
    h-11
    w-11
    shrink-0
    items-center
    justify-center
    rounded-full
    text-charcoal/65
    transition
    active:scale-95
    hover:bg-charcoal/5
    hover:text-charcoal
    disabled:pointer-events-none
    disabled:opacity-25
  `;

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-[60]
        border-t
        border-charcoal/10
        bg-ivory/95
        shadow-[0_-12px_40px_rgba(0,0,0,0.10)]
        backdrop-blur-xl
      "
    >
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8">

        {/* ================================================================= */}
        {/* MAJOR DRAGGABLE PROGRESS BAR                                     */}
        {/* ================================================================= */}

        <div className="relative h-2 w-full">

          {/* Track */}

          <div
            className="
              absolute
              inset-x-0
              top-1/2
              h-1
              -translate-y-1/2
              rounded-full
              bg-charcoal/10
            "
          />

          {/* Progress */}

          <div
            className="
              pointer-events-none
              absolute
              left-0
              top-1/2
              h-1
              -translate-y-1/2
              rounded-full
              bg-bronze
              transition-[width]
              duration-100
            "
            style={{
              width: `${progress}%`,
            }}
          />

          {/* Invisible / transparent range input */}

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            disabled={!duration}
            onChange={(event) =>
              seek(
                Number(
                  event.target.value,
                ),
              )
            }
            aria-label="Audio progress"
            className="
              absolute
              inset-0
              z-10
              h-2
              w-full
              cursor-pointer
              appearance-none
              bg-transparent
              accent-transparent
              disabled:cursor-default
            "
          />
        </div>

        {/* ================================================================= */}
        {/* DESKTOP / TABLET MAIN PLAYER                                     */}
        {/* ================================================================= */}

        <div
          className="
            hidden
            min-h-[76px]
            items-center
            gap-3
            py-2.5
            md:flex
            sm:gap-4
            sm:py-3
          "
        >
          {/* -------------------------------------------------------------- */}
          {/* Thumbnail                                                       */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              relative
              h-12
              w-12
              shrink-0
              overflow-hidden
              rounded-xl
              bg-charcoal
              sm:h-14
              sm:w-14
            "
          >
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={
                  currentItem.resource.title ||
                  "Audio thumbnail"
                }
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  text-ivory
                "
              >
                <Volume2
                  className="h-5 w-5"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Track information                                               */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              min-w-0
              max-w-[180px]
              shrink
              sm:max-w-[260px]
              lg:max-w-[320px]
            "
          >
            <p
              className="
                truncate
                text-xs
                font-medium
                uppercase
                tracking-[0.08em]
                text-bronze
              "
            >
              Now Playing
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-sm
                font-medium
                text-charcoal
                sm:text-[15px]
              "
              title={currentItem.resource.title}
            >
              {currentItem.resource.title}
            </p>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Desktop controls                                                */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
            "
          >
            {/* Previous */}

            <button
              type="button"
              onClick={() => {
                void previous();
              }}
              disabled={!hasPrevious}
              aria-label="Previous audio"
              title="Previous audio"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-charcoal/65
                transition
                hover:bg-charcoal/5
                hover:text-charcoal
                disabled:pointer-events-none
                disabled:opacity-25
              "
            >
              <ChevronLeft
                className="h-4 w-4"
                strokeWidth={1.7}
              />
            </button>

            {/* Rewind */}

            <button
              type="button"
              onClick={() =>
                skipBackward(10)
              }
              aria-label="Rewind 10 seconds"
              title="Rewind 10 seconds"
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-charcoal/65
                transition
                hover:bg-charcoal/5
                hover:text-charcoal
              "
            >
              <RotateCcw
                className="h-4 w-4"
                strokeWidth={1.7}
              />

              <span
                className="
                  absolute
                  text-[7px]
                  font-semibold
                  text-charcoal/70
                "
              >
                10
              </span>
            </button>

            {/* Play / pause */}

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
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-charcoal
                text-ivory
                transition
                hover:bg-charcoal/90
                active:scale-95
                disabled:opacity-60
              "
            >
              {isLoading ? (
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
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

            {/* Forward */}

            <button
              type="button"
              onClick={() =>
                skipForward(10)
              }
              aria-label="Forward 10 seconds"
              title="Forward 10 seconds"
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-charcoal/65
                transition
                hover:bg-charcoal/5
                hover:text-charcoal
              "
            >
              <RotateCw
                className="h-4 w-4"
                strokeWidth={1.7}
              />

              <span
                className="
                  absolute
                  text-[7px]
                  font-semibold
                  text-charcoal/70
                "
              >
                10
              </span>
            </button>

            {/* Next */}

            <button
              type="button"
              onClick={() => {
                void next();
              }}
              disabled={!hasNext}
              aria-label="Next audio"
              title="Next audio"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-charcoal/65
                transition
                hover:bg-charcoal/5
                hover:text-charcoal
                disabled:pointer-events-none
                disabled:opacity-25
              "
            >
              <ChevronRight
                className="h-4 w-4"
                strokeWidth={1.7}
              />
            </button>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Desktop time                                                     */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-1.5
              text-[10px]
              tabular-nums
              text-charcoal/45
            "
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

          {/* -------------------------------------------------------------- */}
          {/* Desktop volume                                                  */}
          {/* -------------------------------------------------------------- */}

          <div className="relative shrink-0">
            {isVolumeOpen && (
              <div
                className="
                  absolute
                  bottom-full
                  left-1/2
                  mb-3
                  flex
                  h-28
                  -translate-x-1/2
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-charcoal/10
                  bg-ivory
                  px-3
                  py-3
                  shadow-[0_14px_40px_rgba(0,0,0,0.18)]
                  ring-1
                  ring-black/5
                  backdrop-blur-xl
                "
              >
                {/* ------------------------------------------------------ */}
                {/* Visual volume track                                     */}
                {/* ------------------------------------------------------ */}

                <div className="relative h-20 w-5">

                  {/* Track */}

                  <div
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      h-20
                      w-1.5
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-charcoal/10
                    "
                  />

                  {/* Filled volume */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      left-1/2
                      w-1.5
                      -translate-x-1/2
                      rounded-full
                      bg-bronze
                    "
                    style={{
                      height: `${volumeProgress}%`,
                    }}
                  />

                  {/* Invisible range input */}

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={effectiveVolume}
                    onChange={(event) =>
                      setVolume(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    aria-label="Volume"
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      z-10
                      h-20
                      w-5
                      -translate-x-1/2
                      -translate-y-1/2
                      cursor-pointer
                      appearance-none
                      bg-transparent
                      accent-transparent
                    "
                    style={{
                      writingMode:
                        "vertical-lr",
                      direction:
                        "rtl",
                    }}
                  />

                  {/* Volume thumb */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      z-20
                      h-3
                      w-3
                      -translate-x-1/2
                      rounded-full
                      bg-bronze
                      shadow-[0_1px_5px_rgba(0,0,0,0.20)]
                      ring-2
                      ring-ivory
                    "
                    style={{
                      bottom: `calc(${volumeProgress}% - 6px)`,
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
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-charcoal/60
                transition
                hover:bg-charcoal/5
                hover:text-charcoal
              "
            >
              {isMuted ||
              volume === 0 ? (
                <VolumeX
                  className="h-4 w-4"
                  strokeWidth={1.7}
                />
              ) : (
                <Volume2
                  className="h-4 w-4"
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Desktop download                                                */}
          {/* -------------------------------------------------------------- */}

          <button
            type="button"
            onClick={() => {
              void handleDownload();
            }}
            disabled={isDownloading}
            aria-label="Download audio"
            title="Download audio"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-charcoal/60
              transition
              hover:bg-charcoal/5
              hover:text-charcoal
              disabled:opacity-40
            "
          >
            {isDownloading ? (
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />
            ) : (
              <Download
                className="h-4 w-4"
                strokeWidth={1.7}
              />
            )}
          </button>

          {/* -------------------------------------------------------------- */}
          {/* Desktop close                                                   */}
          {/* -------------------------------------------------------------- */}

          <button
            type="button"
            onClick={stop}
            aria-label="Close audio player"
            title="Close player"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-charcoal/45
              transition
              hover:bg-charcoal/5
              hover:text-charcoal
            "
          >
            <X
              className="h-4 w-4"
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* ================================================================= */}
        {/* MOBILE PLAYER                                                     */}
        {/* ================================================================= */}

        <div className="md:hidden">

          {/* -------------------------------------------------------------- */}
          {/* Mobile track header                                             */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              py-2.5
            "
          >
            {/* Thumbnail */}

            <div
              className="
                relative
                h-11
                w-11
                shrink-0
                overflow-hidden
                rounded-lg
                bg-charcoal
              "
            >
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={
                    currentItem.resource.title ||
                    "Audio thumbnail"
                  }
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    text-ivory
                  "
                >
                  <Volume2
                    className="h-4 w-4"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>

            {/* Track information */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-bronze
                "
              >
                Now Playing
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[13px]
                  font-medium
                  leading-5
                  text-charcoal
                "
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
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                text-charcoal/45
                transition
                active:scale-95
                hover:bg-charcoal/5
                hover:text-charcoal
              "
            >
              <X
                className="h-4 w-4"
                strokeWidth={1.7}
              />
            </button>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Mobile controls                                                 */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              flex
              items-center
              justify-between
              py-1.5
            "
          >
            {/* Previous */}

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
                className="h-[18px] w-[18px]"
                strokeWidth={1.7}
              />
            </button>

            {/* Rewind */}

            <button
              type="button"
              onClick={() =>
                skipBackward(10)
              }
              aria-label="Rewind 10 seconds"
              title="Rewind 10 seconds"
              className={`${mobileIconButton} relative`}
            >
              <RotateCcw
                className="h-[17px] w-[17px]"
                strokeWidth={1.7}
              />

              <span
                className="
                  absolute
                  text-[7px]
                  font-semibold
                  text-charcoal/70
                "
              >
                10
              </span>
            </button>

            {/* Play / pause */}

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
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-charcoal
                text-ivory
                shadow-sm
                transition
                active:scale-95
                disabled:opacity-60
              "
            >
              {isLoading ? (
                <Loader2
                  className="
                    h-[17px]
                    w-[17px]
                    animate-spin
                  "
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

            {/* Forward */}

            <button
              type="button"
              onClick={() =>
                skipForward(10)
              }
              aria-label="Forward 10 seconds"
              title="Forward 10 seconds"
              className={`${mobileIconButton} relative`}
            >
              <RotateCw
                className="h-[17px] w-[17px]"
                strokeWidth={1.7}
              />

              <span
                className="
                  absolute
                  text-[7px]
                  font-semibold
                  text-charcoal/70
                "
              >
                10
              </span>
            </button>

            {/* Next */}

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
                className="h-[18px] w-[18px]"
                strokeWidth={1.7}
              />
            </button>

            {/* ---------------------------------------------------------- */}
            {/* Mobile volume                                                */}
            {/* ---------------------------------------------------------- */}

            <div className="relative">
              {isVolumeOpen && (
                <div
                  className="
                    absolute
                    bottom-full
                    right-0
                    mb-3
                    flex
                    h-32
                    w-14
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-charcoal/10
                    bg-ivory
                    px-2
                    py-3
                    shadow-[0_14px_40px_rgba(0,0,0,0.20)]
                    ring-1
                    ring-black/5
                    backdrop-blur-xl
                  "
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
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      text-charcoal/60
                      transition
                      hover:bg-charcoal/5
                      hover:text-charcoal
                    "
                  >
                    {isMuted ||
                    volume === 0 ? (
                      <VolumeX
                        className="h-4 w-4"
                        strokeWidth={1.7}
                      />
                    ) : (
                      <Volume2
                        className="h-4 w-4"
                        strokeWidth={1.7}
                      />
                    )}
                  </button>

                  {/* ---------------------------------------------------- */}
                  {/* Mobile visual volume slider                         */}
                  {/* ---------------------------------------------------- */}

                  <div className="relative h-20 w-5">

                    {/* Track */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        h-20
                        w-1.5
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-charcoal/10
                      "
                    />

                    {/* Filled volume */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-1/2
                        w-1.5
                        -translate-x-1/2
                        rounded-full
                        bg-bronze
                      "
                      style={{
                        height: `${volumeProgress}%`,
                      }}
                    />

                    {/* Invisible range input */}

                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={effectiveVolume}
                      onChange={(event) =>
                        setVolume(
                          Number(
                            event.target.value,
                          ),
                        )
                      }
                      aria-label="Volume"
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        z-10
                        h-20
                        w-5
                        -translate-x-1/2
                        -translate-y-1/2
                        cursor-pointer
                        appearance-none
                        bg-transparent
                        accent-transparent
                      "
                      style={{
                        writingMode:
                          "vertical-lr",
                        direction:
                          "rtl",
                      }}
                    />

                    {/* Volume thumb */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-1/2
                        z-20
                        h-3
                        w-3
                        -translate-x-1/2
                        rounded-full
                        bg-bronze
                        shadow-[0_1px_5px_rgba(0,0,0,0.20)]
                        ring-2
                        ring-ivory
                      "
                      style={{
                        bottom: `calc(${volumeProgress}% - 6px)`,
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
                className={mobileIconButton}
              >
                {isMuted ||
                volume === 0 ? (
                  <VolumeX
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.7}
                  />
                ) : (
                  <Volume2
                    className="h-[17px] w-[17px]"
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
                  className="
                    h-[17px]
                    w-[17px]
                    animate-spin
                  "
                />
              ) : (
                <Download
                  className="h-[17px] w-[17px]"
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Mobile time only                                                */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              flex
              items-center
              justify-between
              pb-2.5
              pt-0.5
              text-[9px]
              tabular-nums
              text-charcoal/40
            "
          >
            <span>
              {formatTime(currentTime)}
            </span>

            <span>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

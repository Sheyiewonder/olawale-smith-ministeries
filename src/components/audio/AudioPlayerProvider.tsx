"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Resource, MediaAsset } from "@/lib/api";

export interface AudioPlayerPlaylistItem {
  resource: Resource;
  media: MediaAsset;
}

interface AudioPlayerContextValue {
  currentItem: AudioPlayerPlaylistItem | null;
  playlist: AudioPlayerPlaylistItem[];
  currentIndex: number;

  isPlaying: boolean;
  isLoading: boolean;
  isMinimized: boolean;

  currentTime: number;
  duration: number;

  volume: number;
  isMuted: boolean;
  playbackRate: number;

  hasPrevious: boolean;
  hasNext: boolean;

  play: (
    resource: Resource,
    media?: MediaAsset,
    playlist?: Resource[],
  ) => Promise<void>;

  pause: () => void;
  togglePlay: () => void;

  previous: () => Promise<void>;
  next: () => Promise<void>;

  stop: () => void;

  seek: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;

  setVolume: (volume: number) => void;
  toggleMute: () => void;

  setPlaybackRate: (rate: number) => void;

  download: () => Promise<void>;

  minimize: () => void;
  maximize: () => void;
}

const AudioPlayerContext =
  createContext<AudioPlayerContextValue | null>(null);

interface AudioPlayerProviderProps {
  children: ReactNode;
}

type PlayItemFunction = (
  item: AudioPlayerPlaylistItem,
  index: number,
  autoplay?: boolean,
) => Promise<void>;

function getAudioMedia(resource: Resource): MediaAsset | null {
  return (
    resource.media?.find(
      (media) =>
        media.type === "AUDIO" &&
        Boolean(media.url),
    ) ?? null
  );
}

function buildPlaylist(
  resources: Resource[],
): AudioPlayerPlaylistItem[] {
  return resources
    .map((resource) => {
      const media = getAudioMedia(resource);

      if (!media) {
        return null;
      }

      return {
        resource,
        media,
      };
    })
    .filter(
      (
        item,
      ): item is AudioPlayerPlaylistItem =>
        item !== null,
    );
}

function isAbortError(error: unknown) {
  if (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException
  ) {
    return error.name === "AbortError";
  }

  if (error instanceof Error) {
    return error.name === "AbortError";
  }

  return false;
}

export default function AudioPlayerProvider({
  children,
}: AudioPlayerProviderProps) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const playItemRef =
    useRef<PlayItemFunction | null>(null);

  const playlistRef =
    useRef<AudioPlayerPlaylistItem[]>([]);

  const currentIndexRef =
    useRef(-1);

  const currentItemRef =
    useRef<AudioPlayerPlaylistItem | null>(null);

  const isPlayingRef =
    useRef(false);

  /*
   * Every playback operation receives a unique ID.
   *
   * If another operation starts before an older async
   * audio.play() resolves, the older operation becomes
   * invalid and is not allowed to update player state.
   */
  const playbackRequestRef =
    useRef(0);

  const [currentItem, setCurrentItem] =
    useState<AudioPlayerPlaylistItem | null>(null);

  const [playlist, setPlaylist] =
    useState<AudioPlayerPlaylistItem[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isMinimized, setIsMinimized] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolumeState] =
    useState(1);

  const [isMuted, setIsMuted] =
    useState(false);

  const [playbackRate, setPlaybackRateState] =
    useState(1);

  const syncPlaylist = useCallback(
    (nextPlaylist: AudioPlayerPlaylistItem[]) => {
      playlistRef.current = nextPlaylist;
      setPlaylist(nextPlaylist);
    },
    [],
  );

  const updateCurrentIndex = useCallback(
    (index: number) => {
      currentIndexRef.current = index;
      setCurrentIndex(index);
    },
    [],
  );

  const updateCurrentItem = useCallback(
    (item: AudioPlayerPlaylistItem | null) => {
      currentItemRef.current = item;
      setCurrentItem(item);
    },
    [],
  );

  const updatePlayingState = useCallback(
    (playing: boolean) => {
      isPlayingRef.current = playing;
      setIsPlaying(playing);
    },
    [],
  );

  /*
   * Load and optionally play a playlist item.
   */
  const playItem = useCallback(
    async (
      item: AudioPlayerPlaylistItem,
      index: number,
      autoplay = true,
    ) => {
      const audio = audioRef.current;

      if (!audio || !item.media.url) {
        return;
      }

      /*
       * Invalidate every previous playback operation.
       */
      const requestId =
        ++playbackRequestRef.current;

      updateCurrentItem(item);
      updateCurrentIndex(index);

      setIsLoading(true);
      setCurrentTime(0);
      setDuration(0);

      /*
       * Stop the currently playing source.
       *
       * IMPORTANT:
       * We intentionally do NOT clear audio.src here.
       * Clearing src can trigger:
       *
       * MEDIA_ELEMENT_ERROR: Empty src attribute
       *
       * while the browser is still processing the
       * previous media element state.
       */
      audio.pause();

      /*
       * Replace the source directly.
       *
       * Cloudinary audio URLs may legitimately use:
       *
       * /video/upload/
       *
       * because Cloudinary handles audio/video media
       * under its video resource type.
       */
      audio.src = item.media.url;

      audio.currentTime = 0;

      audio.volume =
        isMuted ? 0 : volume;

      audio.muted = isMuted;
      audio.playbackRate = playbackRate;

      /*
       * Force the browser to load the new source.
       */
      audio.load();

      if (!autoplay) {
        if (
          requestId ===
          playbackRequestRef.current
        ) {
          updatePlayingState(false);
          setIsLoading(false);
        }

        return;
      }

      try {
        await audio.play();

        /*
         * The user may have selected another track,
         * paused, stopped, or otherwise changed playback
         * while the browser was resolving play().
         */
        if (
          requestId !==
          playbackRequestRef.current
        ) {
          return;
        }

        updatePlayingState(true);
      } catch (error) {
        /*
         * AbortError is expected when a newer operation
         * pauses or replaces the audio.
         */
        if (isAbortError(error)) {
          return;
        }

        if (
          requestId ===
          playbackRequestRef.current
        ) {
          console.error(
            "Failed to play audio:",
            error,
          );

          updatePlayingState(false);
        }
      } finally {
        if (
          requestId ===
          playbackRequestRef.current
        ) {
          setIsLoading(false);
        }
      }
    },
    [
      isMuted,
      playbackRate,
      updateCurrentIndex,
      updateCurrentItem,
      updatePlayingState,
      volume,
    ],
  );

  useEffect(() => {
    playItemRef.current = playItem;
  }, [playItem]);

  /*
   * Automatically move to the next track when the
   * current track finishes.
   */
  const handleEnded = useCallback(() => {
    const items = playlistRef.current;
    const index = currentIndexRef.current;

    const nextIndex = index + 1;

    if (nextIndex < items.length) {
      void playItemRef.current?.(
        items[nextIndex],
        nextIndex,
        true,
      );

      return;
    }

    updatePlayingState(false);
  }, [updatePlayingState]);

  /*
   * Create the native Audio element ONCE.
   *
   * IMPORTANT:
   * This effect deliberately does NOT depend on:
   *
   * - volume
   * - isMuted
   * - playbackRate
   * - playItem
   *
   * Those values are synchronized separately.
   */
  useEffect(() => {
    const audio = new Audio();

    audio.preload = "metadata";
    audio.volume = volume;
    audio.muted = isMuted;
    audio.playbackRate = playbackRate;

    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        setDuration(audio.duration);
      }

      setIsLoading(false);
    };

    const handleDurationChange = () => {
      if (
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (
        Number.isFinite(audio.currentTime)
      ) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handlePlay = () => {
      updatePlayingState(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      updatePlayingState(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      updatePlayingState(false);

      const mediaError = audio.error;

      const currentSource =
        audio.currentSrc || "";

      /*
       * If there is genuinely no current source, this is
       * normally the browser reacting to a source reset
       * or an element lifecycle transition.
       *
       * We no longer intentionally clear src anywhere
       * during normal stop/cleanup, but keeping this guard
       * prevents noisy "Empty src attribute" errors from
       * being treated as a Cloudinary failure.
       */
      if (
        !currentSource &&
        mediaError?.code ===
          MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
      ) {
        return;
      }

      console.error(
        "Audio playback error:",
        {
          code:
            mediaError?.code ?? null,

          message:
            mediaError?.message ||
            "No browser error message available.",

          src:
            currentSource ||
            audio.src ||
            null,

          networkState:
            audio.networkState,

          readyState:
            audio.readyState,

          paused:
            audio.paused,

          ended:
            audio.ended,

          duration:
            Number.isFinite(audio.duration)
              ? audio.duration
              : null,
        },
      );

      if (mediaError) {
        switch (mediaError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            console.warn(
              "Audio playback was aborted.",
            );
            break;

          case MediaError.MEDIA_ERR_NETWORK:
            console.warn(
              "The browser encountered a network error while loading the audio.",
            );
            break;

          case MediaError.MEDIA_ERR_DECODE:
            console.warn(
              "The browser downloaded the audio but could not decode it. Check the audio format/encoding.",
            );
            break;

          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            console.warn(
              "The browser does not support the audio source or the server returned an unsupported media type.",
            );
            break;

          default:
            console.warn(
              "Unknown browser audio error.",
            );
        }
      }
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
    );

    audio.addEventListener(
      "durationchange",
      handleDurationChange,
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate,
    );

    audio.addEventListener(
      "play",
      handlePlay,
    );

    audio.addEventListener(
      "pause",
      handlePause,
    );

    audio.addEventListener(
      "waiting",
      handleWaiting,
    );

    audio.addEventListener(
      "canplay",
      handleCanPlay,
    );

    audio.addEventListener(
      "error",
      handleError,
    );

    audio.addEventListener(
      "ended",
      handleEnded,
    );

    return () => {
      /*
       * Invalidate every pending playback operation.
       */
      playbackRequestRef.current += 1;

      /*
       * Pause the element, but DO NOT clear its src.
       *
       * The element is about to be discarded anyway, and
       * removing its source here can itself produce:
       *
       * MEDIA_ELEMENT_ERROR: Empty src attribute
       */
      audio.pause();

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );

      audio.removeEventListener(
        "durationchange",
        handleDurationChange,
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate,
      );

      audio.removeEventListener(
        "play",
        handlePlay,
      );

      audio.removeEventListener(
        "pause",
        handlePause,
      );

      audio.removeEventListener(
        "waiting",
        handleWaiting,
      );

      audio.removeEventListener(
        "canplay",
        handleCanPlay,
      );

      audio.removeEventListener(
        "error",
        handleError,
      );

      audio.removeEventListener(
        "ended",
        handleEnded,
      );

      audioRef.current = null;
      playItemRef.current = null;
    };

    /*
     * Deliberately only recreate the Audio element when
     * the provider lifecycle itself changes.
     */
  }, [
    handleEnded,
    updatePlayingState,
  ]);

  /*
   * Keep volume and mute synchronized with the
   * existing Audio element.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume =
      isMuted ? 0 : volume;

    audio.muted = isMuted;
  }, [isMuted, volume]);

  /*
   * Keep playback speed synchronized.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  const play = useCallback(
    async (
      resource: Resource,
      media?: MediaAsset,
      resources?: Resource[],
    ) => {
      const selectedMedia =
        media ?? getAudioMedia(resource);

      if (!selectedMedia?.url) {
        console.warn(
          "No playable audio media found for resource:",
          resource.title,
        );

        return;
      }

      let resolvedPlaylist: AudioPlayerPlaylistItem[];

      if (resources?.length) {
        resolvedPlaylist =
          buildPlaylist(resources);

        const selectedExists =
          resolvedPlaylist.some(
            (item) =>
              item.resource.id === resource.id &&
              item.media.id === selectedMedia.id,
          );

        if (!selectedExists) {
          resolvedPlaylist = [
            {
              resource,
              media: selectedMedia,
            },
            ...resolvedPlaylist,
          ];
        }
      } else {
        resolvedPlaylist = [
          {
            resource,
            media: selectedMedia,
          },
        ];
      }

      const selectedIndex =
        resolvedPlaylist.findIndex(
          (item) =>
            item.resource.id === resource.id &&
            item.media.id === selectedMedia.id,
        );

      const fallbackIndex =
        resolvedPlaylist.findIndex(
          (item) =>
            item.resource.id === resource.id,
        );

      const index =
        selectedIndex >= 0
          ? selectedIndex
          : fallbackIndex >= 0
            ? fallbackIndex
            : 0;

      syncPlaylist(resolvedPlaylist);

      const current =
        currentItemRef.current;

      const audio = audioRef.current;

      /*
       * If this exact track is already loaded:
       *
       * paused  -> resume
       * playing -> pause
       *
       * Do not reset the track.
       */
      if (
        current &&
        current.resource.id === resource.id &&
        current.media.id === selectedMedia.id &&
        audio &&
        audio.src
      ) {
        if (audio.paused) {
          const requestId =
            ++playbackRequestRef.current;

          try {
            setIsLoading(true);

            await audio.play();

            if (
              requestId !==
              playbackRequestRef.current
            ) {
              return;
            }

            updatePlayingState(true);
          } catch (error) {
            if (!isAbortError(error)) {
              console.error(
                "Failed to resume audio:",
                error,
              );
            }

            if (
              requestId ===
              playbackRequestRef.current
            ) {
              updatePlayingState(false);
            }
          } finally {
            if (
              requestId ===
              playbackRequestRef.current
            ) {
              setIsLoading(false);
            }
          }
        } else {
          /*
           * Invalidate any pending play() before
           * intentionally pausing.
           */
          playbackRequestRef.current += 1;

          audio.pause();

          updatePlayingState(false);
          setIsLoading(false);
        }

        updateCurrentIndex(index);

        return;
      }

      await playItem(
        resolvedPlaylist[index],
        index,
        true,
      );
    },
    [
      playItem,
      syncPlaylist,
      updateCurrentIndex,
      updatePlayingState,
    ],
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    /*
     * Invalidate any pending play() promise.
     */
    playbackRequestRef.current += 1;

    audio.pause();

    updatePlayingState(false);
    setIsLoading(false);
  }, [updatePlayingState]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;

    if (
      !audio ||
      !currentItemRef.current
    ) {
      return;
    }

    if (audio.paused) {
      const requestId =
        ++playbackRequestRef.current;

      setIsLoading(true);

      void audio
        .play()
        .then(() => {
          if (
            requestId !==
            playbackRequestRef.current
          ) {
            return;
          }

          updatePlayingState(true);
        })
        .catch((error) => {
          if (!isAbortError(error)) {
            console.error(
              "Failed to play audio:",
              error,
            );
          }

          if (
            requestId ===
            playbackRequestRef.current
          ) {
            updatePlayingState(false);
          }
        })
        .finally(() => {
          if (
            requestId ===
            playbackRequestRef.current
          ) {
            setIsLoading(false);
          }
        });
    } else {
      /*
       * Invalidate any pending play() operation before
       * intentionally pausing.
       */
      playbackRequestRef.current += 1;

      audio.pause();

      updatePlayingState(false);
      setIsLoading(false);
    }
  }, [updatePlayingState]);

  const next = useCallback(async () => {
    const items = playlistRef.current;
    const index = currentIndexRef.current;

    const nextIndex = index + 1;

    if (nextIndex >= items.length) {
      return;
    }

    const nextItem = items[nextIndex];

    if (!nextItem) {
      return;
    }

    await playItem(
      nextItem,
      nextIndex,
      true,
    );
  }, [playItem]);

  const previous = useCallback(async () => {
    const audio = audioRef.current;

    const items = playlistRef.current;
    const index = currentIndexRef.current;

    /*
     * If we're more than three seconds into the
     * current track, restart it.
     */
    if (
      audio &&
      audio.currentTime > 3
    ) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const previousIndex = index - 1;

    if (previousIndex < 0) {
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }

      return;
    }

    const previousItem =
      items[previousIndex];

    if (!previousItem) {
      return;
    }

    await playItem(
      previousItem,
      previousIndex,
      true,
    );
  }, [playItem]);

  const stop = useCallback(() => {
    /*
     * Invalidate every pending playback operation.
     */
    playbackRequestRef.current += 1;

    const audio = audioRef.current;

    if (audio) {
      audio.pause();

      /*
       * Reset playback position but deliberately KEEP
       * the current src.
       *
       * Setting audio.src = "" causes browsers to emit:
       *
       * MEDIA_ELEMENT_ERROR: Empty src attribute
       *
       * even though nothing is actually wrong with the
       * Cloudinary file.
       */
      try {
        audio.currentTime = 0;
      } catch {
        /*
         * Ignore currentTime errors if the browser has
         * not established media metadata yet.
         */
      }
    }

    updateCurrentItem(null);
    updateCurrentIndex(-1);
    updatePlayingState(false);

    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);

    syncPlaylist([]);
  }, [
    syncPlaylist,
    updateCurrentIndex,
    updateCurrentItem,
    updatePlayingState,
  ]);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;

      if (
        !audio ||
        !Number.isFinite(time)
      ) {
        return;
      }

      const nextTime = Math.max(
        0,
        Math.min(
          time,
          Number.isFinite(audio.duration)
            ? audio.duration
            : time,
        ),
      );

      try {
        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
      } catch {
        /*
         * Ignore seeks that occur before media metadata
         * has become available.
         */
      }
    },
    [],
  );

  const skipForward = useCallback(
    (seconds = 10) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      seek(
        audio.currentTime + seconds,
      );
    },
    [seek],
  );

  const skipBackward = useCallback(
    (seconds = 10) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      seek(
        audio.currentTime - seconds,
      );
    },
    [seek],
  );

  const setVolume = useCallback(
    (nextVolume: number) => {
      const audio = audioRef.current;

      const normalizedVolume =
        Math.max(
          0,
          Math.min(1, nextVolume),
        );

      setVolumeState(
        normalizedVolume,
      );

      if (normalizedVolume > 0) {
        setIsMuted(false);
      }

      if (audio) {
        audio.volume =
          normalizedVolume;

        if (normalizedVolume > 0) {
          audio.muted = false;
        }
      }
    },
    [],
  );

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;

    setIsMuted((previous) => {
      const nextMuted = !previous;

      if (audio) {
        audio.muted = nextMuted;
      }

      return nextMuted;
    });
  }, []);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      const allowedRates = [
        0.5,
        0.75,
        1,
        1.25,
        1.5,
        1.75,
        2,
      ];

      const closestRate =
        allowedRates.reduce(
          (closest, candidate) =>
            Math.abs(
              candidate - rate,
            ) <
            Math.abs(
              closest - rate,
            )
              ? candidate
              : closest,
        );

      setPlaybackRateState(
        closestRate,
      );

      const audio = audioRef.current;

      if (audio) {
        audio.playbackRate =
          closestRate;
      }
    },
    [],
  );

  const download = useCallback(
    async () => {
      const item =
        currentItemRef.current;

      if (!item?.media.url) {
        return;
      }

      try {
        const response = await fetch(
          item.media.url,
        );

        if (!response.ok) {
            throw new Error(
                `Failed to download audio: ${response.status} ${response.statusText}`,
            );
        }

        const blob =
          await response.blob();

        const objectUrl =
          URL.createObjectURL(blob);

        const anchor =
          document.createElement("a");

        anchor.href = objectUrl;

        const resourceTitle =
          item.resource.title?.trim() ||
          item.media.title?.trim() ||
          "audio";

        const safeFilename =
          resourceTitle
            .replace(
              /[<>:"/\\|?*\u0000-\u001F]/g,
              "",
            )
            .replace(/\s+/g, " ")
            .trim() || "audio";

        const extension =
          item.media.mimeType
            ?.split("/")
            .pop()
            ?.replace(
              "mpeg",
              "mp3",
            )
            ?.replace(
              "x-m4a",
              "m4a",
            ) ||
          "mp3";

        anchor.download =
          `${safeFilename}.${extension}`;

        anchor.style.display = "none";

        document.body.appendChild(
          anchor,
        );

        anchor.click();

        anchor.remove();

        /*
         * Give the browser a moment to consume the
         * object URL before revoking it.
         */
        window.setTimeout(() => {
          URL.revokeObjectURL(
            objectUrl,
          );
        }, 1000);
      } catch (error) {
        console.error(
          "Failed to download audio:",
          error,
        );
      }
    },
    [],
  );

  const minimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const maximize = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const value =
    useMemo<AudioPlayerContextValue>(
      () => ({
        currentItem,
        playlist,
        currentIndex,

        isPlaying,
        isLoading,
        isMinimized,

        currentTime,
        duration,

        volume,
        isMuted,
        playbackRate,

        hasPrevious:
          currentIndex > 0,

        hasNext:
          currentIndex >= 0 &&
          currentIndex <
            playlist.length - 1,

        play,

        pause,
        togglePlay,

        previous,
        next,

        stop,

        seek,
        skipForward,
        skipBackward,

        setVolume,
        toggleMute,

        setPlaybackRate,

        download,

        minimize,
        maximize,
      }),
      [
        currentItem,
        playlist,
        currentIndex,

        isPlaying,
        isLoading,
        isMinimized,

        currentTime,
        duration,

        volume,
        isMuted,
        playbackRate,

        play,

        pause,
        togglePlay,

        previous,
        next,

        stop,

        seek,
        skipForward,
        skipBackward,

        setVolume,
        toggleMute,

        setPlaybackRate,

        download,

        minimize,
        maximize,
      ],
    );

  return (
    <AudioPlayerContext.Provider
      value={value}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context =
    useContext(AudioPlayerContext);

  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider",
    );
  }

  return context;
}

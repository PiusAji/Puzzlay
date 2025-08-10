import { useState, useEffect, useCallback } from 'react'

export function useSound(soundUrl: string, volume = 0.5) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fetch the audio file as a blob to avoid range request issues
      fetch(soundUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob)
          const audioInstance = new Audio(url)
          audioInstance.volume = volume
          setAudio(audioInstance)
        })
        .catch((err) => console.error(`Failed to load sound: ${soundUrl}`, err))
    }
  }, [soundUrl, volume])

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((err) => console.error(`Audio play failed for ${soundUrl}:`, err))
    }
  }, [audio, soundUrl])

  return play
}

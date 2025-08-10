import { Model } from '../Model'

interface ModelWrapperProps {
  modelKey: string
  modelUrl?: string
  textureUrl?: string
}

export function ModelWrapper({ modelKey, modelUrl, textureUrl }: ModelWrapperProps) {
  if (!modelKey) return null

  return <Model key={modelKey} modelUrl={modelUrl} textureUrl={textureUrl} />
}

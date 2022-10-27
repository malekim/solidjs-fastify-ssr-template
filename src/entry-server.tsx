import { renderToString, generateHydrationScript } from 'solid-js/web'
import { renderTags } from 'solid-meta'
import Server, { TagDescription } from '@/src/Server'

export const render = (url: string): {
  head: string
  hydration: string
  body: string
} => {
  const tags: TagDescription[] = []
  const body = renderToString(() => <Server tags={tags} url={url} />)
  const hydration = generateHydrationScript()
  const head = renderTags(tags)
  return {
    head,
    hydration,
    body
  }
}

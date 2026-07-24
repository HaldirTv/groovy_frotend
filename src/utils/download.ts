// Завантаження файлу з довільного (у т.ч. cross-origin, як Cloudflare R2) URL.
// Просте <a href={url} download> браузери ігнорують для cross-origin посилань — замість
// збереження файл просто відкривається/показується. Тому тягнемо вміст через fetch і
// зберігаємо вже як blob: URL того самого origin, де атрибут download працює завжди.
export const downloadFile = async (url: string, fileName?: string | null): Promise<void> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити файл: ${response.status}`)
  }
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName || 'download'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

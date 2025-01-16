import Lenis from '@studio-freight/lenis'
import { ref, onMounted, onBeforeUnmount } from 'vue'

export const useLenis = (content: HTMLElement | null) => {
  const lenis = ref<Lenis | null>(null)

  const handleLenisScroll = (e: any) => {
    // Add your scroll handling logic here
    console.log('Scroll:', e)
  }

  const initLenis = () => {
    if (!content) return

    lenis.value = new Lenis({
      orientation: 'horizontal',
      content: content,
      lerp: 0.05,
      smoothWheel: true
    })

    lenis.value.on('scroll', handleLenisScroll)

    function raf(time: number) {
      lenis.value?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    
    // Reset scroll position
    lenis.value.scrollTo(0, { immediate: true })
  }

  onMounted(() => {
    if (process.client) {
      initLenis()
    }
  })

  onBeforeUnmount(() => {
    if (lenis.value) {
      lenis.value.destroy()
    }
  })

  return {
    lenis,
    initLenis
  }
}
declare module "nprogress" {
  const NProgress: {
    start: () => void
    done: () => void
    set: (n: number) => void
    inc: (amount?: number) => void
    configure: (options: {
      minimum?: number
      easing?: string
      speed?: number
      trickle?: boolean
      trickleSpeed?: number
      showSpinner?: boolean
      parent?: string
    }) => void
  }

  export default NProgress
}
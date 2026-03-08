"use client"

import Link from "next/link"
import NProgress from "nprogress"

export default function LinkWithProgress(props: any) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        NProgress.start()
        props.onClick?.(e)
      }}
    />
  )
}
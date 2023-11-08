"use client"

import { useRef, type FC, type HTMLAttributes } from "react"
import { animated } from "@react-spring/web"
import { isClient } from "~/lib/is-client"
import { useHorizontalDragScroll } from "./hook"

const isTouchDevice = () => {
  if (!isClient()) return true // on the server, assume that it is a touch device
  return window.matchMedia("(pointer: coarse)").matches
}

/**

Grabbing to scroll on desktop almost feels like a native scroll in this thing. Just don't ask me how it works.
@see https://codesandbox.io/s/react-spring-920-beta-touch-scrolling-example-5riij
*/
const HorizontalScrollView: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { bind, x } = useHorizontalDragScroll(ref)
  return (
    <animated.div ref={ref} scrollLeft={x} {...props} {...bind()}>
      {children}
    </animated.div>
  )
}

/**

If the device is a touch device, just use the device's native horizontal scrolling features, as they're better than anything we can do.
Otherwise, the browser won't provide a way to scroll horizontally on drag, so we provide a replacement.
*/
export const HorizontalDragScroll: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  if (isTouchDevice()) {
    return <div {...props}>{children}</div>
  }
  return <HorizontalScrollView {...props}>{children}</HorizontalScrollView>
}

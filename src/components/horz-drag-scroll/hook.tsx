import { useSpring } from "@react-spring/web"
import { useGesture } from "@use-gesture/react"

export function useHorizontalDragScroll(ref: React.RefObject<HTMLDivElement>) {
  const decay = 0.995

  const [{ x }, spring] = useSpring(
    () => ({
      x: 0,
      config: { decay: decay },
    }),
    [decay],
  )
  const bind = useGesture(
    {
      onDrag({ event, down, offset }) {
        event.preventDefault()
        spring.start({
          x: -offset[0],
          immediate: down,
          // with @use-gesture/react, velocity doesn't behave quite the same compared to react-use-gesture, so we remove this for now
          // config: {
          // velocity: velocity[0],
          // },
        })
      },
      onWheelStart() {
        // Stop any user-land scroll animation from
        // conflicting with the browser's animation
        spring.stop()
      },
    },
    {
      drag: {
        axis: "x",
        // Allow clicking when use-gesture detects that a click has occurred rather than a drag
        filterTaps: true,
        // Prevent clicking after drag
        preventDefault: true,
        from() {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return [-ref.current!.scrollLeft, 0]
        },
      },
    },
  )

  return { bind, x }
}

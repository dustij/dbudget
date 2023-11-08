import { FC, useCallback, useRef, useState } from "react"
import { cn } from "~/lib/utils"
import { HorizontalDragScroll } from "~/components/horz-drag-scroll/component"
import { useMounted } from "~/hooks/use-mounted"

type SlidingUnderlineNavProps = {
  className?: string
  links: { href: string; text: string }[]
  onLinkClick?: () => void
}

export const SlidingUnderlineNav: FC<SlidingUnderlineNavProps> = ({
  className,
  links,
  onLinkClick,
}) => {
  const [activeLinkElementId, setActiveLinkElementId] = useState<
    string | undefined
  >(links[0]?.href)
  const [animatedUnderlineTransform, setAnimatedUnderlineTransform] =
    useState<string>()
  const [animatedUnderlineWidth, setAnimatedUnderlineWidth] = useState(0)
  const [initialUnderlineVisible, setInitialUnderlineVisible] = useState(true)
  const [animatedUnderlineVisible, setAnimatedUnderlineVisible] =
    useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Store the ref of each link so that we can assess its x location later
  // https://mattclaffey.medium.com/adding-react-refs-to-an-array-of-items-96e9a12ab40c
  // https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
  const linkRefs = useRef<HTMLAnchorElement[]>([])
  const callbackRef = useCallback((node: HTMLAnchorElement | null) => {
    if (node !== null) {
      linkRefs.current.push(node)
    }
  }, [])

  const slideUnderlineToLink = (index: number) => {
    // Calculate the offsetLeft and width of the active link
    const newActiveLinkRef = linkRefs.current[index]
    const offsetLeft =
      (newActiveLinkRef?.offsetLeft ?? 0) -
      (containerRef.current?.offsetLeft ?? 0)
    const width = newActiveLinkRef?.clientWidth ?? 0

    // Make sure the initial underline is invisible.
    setInitialUnderlineVisible(false)

    // Make sure the animated underline is visible.
    setAnimatedUnderlineVisible(true)

    // Move the underline to the new active link.
    setAnimatedUnderlineTransform(`translateX(${offsetLeft}px)`)
    setAnimatedUnderlineWidth(width)
  }

  const hasInitializedUnderline = useRef(false)

  // Once this component has been hydrated, replace the server-side underline with the client-side animated underline.
  const mounted = useMounted()
  if (mounted && !hasInitializedUnderline.current) {
    const activeIndex = links.findIndex(
      (link) => link.href === activeLinkElementId,
    )
    if (activeIndex !== -1) {
      slideUnderlineToLink(activeIndex)
    }
    hasInitializedUnderline.current = true
  }

  return (
    // The grid stuff is just to create a stacking context such that we can position the underline element relatively
    <div ref={containerRef} className={cn("grid", className)}>
      <div className="whitespace-nowrap">
        {/* <HorizontalDragScroll className="cursor-grab-grabbing scrollbar-none grid overflow-x-auto whitespace-nowrap"> */}
        <div style={{ gridArea: "1 / 1 / 1 / 1" }}>
          <div className="flex h-full items-end">
            <div
              className={cn(
                "relative h-[6px] w-[1px] origin-top-left bg-[#0056A1] transition-[width,transform]",
                {
                  hidden: !animatedUnderlineVisible,
                },
              )}
              style={{
                transform: animatedUnderlineTransform,
                width: animatedUnderlineWidth,
              }}
            ></div>
          </div>
        </div>
        <div className="flex gap-x-6" style={{ gridArea: "1 / 1 / 1 / 1" }}>
          {links.map((link, index) => {
            const isActive = link.href === activeLinkElementId
            return (
              <div key={link.href} className="flex flex-col justify-between">
                {/* We use a normal html anchor element rather than a next/link here because the next/link seems to not scroll smoothly. */}
                <a
                  ref={callbackRef}
                  onClick={() => {
                    setActiveLinkElementId(link.href)
                    slideUnderlineToLink(index)
                    onLinkClick?.()
                  }}
                  className={cn("text-lg leading-none md:text-xl", {
                    "font-bold": isActive,
                  })}
                  href={link.href}
                >
                  {link.text}
                </a>
                {/* We put a dummy version of our animated underline on the first element so that on server render, the first element will appear pre-selected. */}
                <div
                  className={cn("h-[6px] w-full bg-[#0056A1]", {
                    invisible: !isActive || !initialUnderlineVisible,
                  })}
                ></div>
              </div>
            )
          })}
        </div>
        {/* </HorizontalDragScroll> */}
      </div>
    </div>
  )
}

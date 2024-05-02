import { useRouter } from "next/router"
import { RxExternalLink } from "react-icons/rx"
import {
  Link as NextLink,
  type LinkProps as NextLinkProps,
} from "@chakra-ui/next-js"
import {
  forwardRef,
  Icon,
  Link as ChakraLink,
  type StyleProps,
  VisuallyHidden,
} from "@chakra-ui/react"

import { type MatomoEventOptions, trackCustomEvent } from "@/lib/utils/matomo"
import { getRelativePath } from "@/lib/utils/relativePath"
import * as url from "@/lib/utils/url"

import { DISCORD_PATH, SITE_URL } from "@/lib/constants"

import { useRtlFlip } from "@/hooks/useRtlFlip"

type BaseProps = {
  /** @deprecated Use `href` prop instead */
  to?: string
  href?: string
  hideArrow?: boolean
  isPartiallyActive?: boolean
  activeStyle?: StyleProps
  customEventOptions?: MatomoEventOptions
}

export type LinkProps = BaseProps & Omit<NextLinkProps, "href">

/**
 * Link wrapper which handles:
 *
 * - Hashed links
 * e.g. <Link href="/page-2/#specific-section">
 *
 * - External links
 * e.g. <Link href="https://example.com/">
 *
 * - PDFs & static files (which open in a new tab)
 * e.g. <Link href="whitepaper.pdf">
 */
export const BaseLink = forwardRef(function Link(
  {
    to,
    href: hrefProp,
    children,
    hideArrow,
    isPartiallyActive = true,
    activeStyle = { color: "primary.base" },
    customEventOptions,
    ...props
  }: LinkProps,
  ref
) {
  let href = (to ?? hrefProp) as string

  const { asPath, locale } = useRouter()
  const { flipForRtl } = useRtlFlip()

  const isActive = url.isHrefActive(href, asPath, isPartiallyActive)
  const isDiscordInvite = url.isDiscordInvite(href)
  const isPdf = url.isPdf(href)
  const isExternal = url.isExternal(href)
  const isInternalPdf = isPdf && !isExternal
  const isHash = url.isHash(href)

  // Get proper download link for internally hosted PDF's & static files (ex: whitepaper)
  // Opens in separate window.
  if (isInternalPdf) {
    href = getRelativePath(asPath, href)
  }

  if (isDiscordInvite) {
    href = new URL(DISCORD_PATH, SITE_URL).href
  }

  const commonProps = {
    ref,
    ...props,
    ...(isActive && activeStyle),
    href,
  }

  if (isInternalPdf || isExternal) {
    if (isExternal) {
      // Parse the URL to handle hash fragments and existing query parameters
      let urlObject = new URL(href, 'https://the.x3.family'); // Provide a base since 'href' might be relative
      urlObject.searchParams.append('ref', 'the.x3.family'); // Automatically handles encoding
    
      // Reconstruct the href with the new query parameter
      href = urlObject.href;
    }
    return (
      <ChakraLink
        isExternal
        onClick={() =>
          trackCustomEvent(
            customEventOptions ?? {
              eventCategory: `Link`,
              eventAction: `Clicked`,
              eventName: `Clicked on ${
                isInternalPdf ? "internal PDF" : "external link"
              }`,
              eventValue: href,
            }
          )
        }
        {...commonProps}
        href={href}
      >
        {children}
        <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
        {!hideArrow && (
          <Icon
            as={RxExternalLink}
            boxSize="6"
            p="1"
            verticalAlign="middle"
            me="-1"
            transform={flipForRtl}
          />
        )}
      </ChakraLink>
    )
  }

  if (isHash) {
    return (
      <ChakraLink
        onClick={(e) => {
          e.stopPropagation()
          trackCustomEvent(
            customEventOptions ?? {
              eventCategory: "Link",
              eventAction: "Clicked",
              eventName: "Clicked on hash link",
              eventValue: href,
            }
          )
        }}
        {...commonProps}
      >
        {children}
      </ChakraLink>
    )
  }

  return (
    <NextLink
      locale={locale}
      onClick={() =>
        trackCustomEvent(
          customEventOptions ?? {
            eventCategory: `Link`,
            eventAction: `Clicked`,
            eventName: `Clicked on internal link`,
            eventValue: href,
          }
        )
      }
      {...commonProps}
    >
      {children}
    </NextLink>
  )
})

const InlineLink = forwardRef((props: LinkProps, ref) => {
  const { locale } = useRouter()

  return <BaseLink data-inline-link ref={ref} locale={locale} {...props} />
})

export default InlineLink

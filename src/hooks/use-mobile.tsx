
import * as React from "react"

// Define breakpoints for better readability and maintainability
export const BREAKPOINTS = {
  MOBILE: 640,  // sm
  TABLET: 768,  // md
  DESKTOP: 1024 // lg
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkIfMobile = () => setIsMobile(window.innerWidth < BREAKPOINTS.TABLET)
    
    // Set initial value
    checkIfMobile()
    
    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return !!isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<"mobile" | "tablet" | "desktop" | undefined>(undefined)

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.MOBILE) {
        setBreakpoint("mobile")
      } else if (width < BREAKPOINTS.DESKTOP) {
        setBreakpoint("tablet")
      } else {
        setBreakpoint("desktop")
      }
    }
    
    // Set initial value
    checkBreakpoint()
    
    // Add event listener for resize
    window.addEventListener("resize", checkBreakpoint)
    
    // Clean up
    return () => window.removeEventListener("resize", checkBreakpoint)
  }, [])

  return breakpoint
}

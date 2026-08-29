/**
 * Utility functions for consistent blur-in animations across components
 */

export type BlurAnimationVariant = "default" | "heavy" | "light" | "scale";

interface BlurAnimationOptions {
    /** Animation variant to use */
    variant?: BlurAnimationVariant;
    /** Additional CSS classes to append */
    className?: string;
    /** Transition delay in milliseconds (will be converted to CSS) */
    delay?: number;
}

/**
 * Get blur animation classes based on visibility state
 * @param isVisible - Whether the element should be visible
 * @param options - Animation options
 * @returns CSS class string for the animation
 */
export function getBlurAnimationClasses(
    isVisible: boolean,
    options: BlurAnimationOptions = {}
): string {
    const { variant = "default", className = "", delay } = options;

    const baseTransition = "transition-[opacity,transform,filter] duration-700 ease-out will-change-[transform,opacity,filter] transform-gpu";

    const variantClasses: Record<BlurAnimationVariant, [string, string]> = {
        default: [
            "opacity-100 translate-y-0 blur-none",
            "opacity-0 translate-y-6 blur-md",
        ],
        heavy: [
            "opacity-100 translate-y-0 scale-100 blur-none",
            "opacity-0 translate-y-10 scale-95 blur-lg",
        ],
        light: [
            "opacity-100 translate-y-0 blur-none",
            "opacity-0 translate-y-4 blur-sm",
        ],
        scale: [
            "opacity-100 scale-100 blur-none",
            "opacity-0 scale-95 blur-md",
        ],
    };

    const [visibleClasses, hiddenClasses] = variantClasses[variant];
    const animationClasses = isVisible ? visibleClasses : hiddenClasses;

    return `${baseTransition} ${animationClasses} ${className}`.trim();
}

/**
 * Get inline styles for animation delay
 * @param delay - Delay in milliseconds
 * @returns React style object with transitionDelay
 */
export function getBlurAnimationDelay(
    delay: number
): React.CSSProperties {
    return {
        transitionDelay: `${delay}ms`,
    };
}

/**
 * Get staggered delay for list items
 * @param index - Item index
 * @param baseDelay - Base delay in milliseconds (default: 0)
 * @param staggerDelay - Delay between items in milliseconds (default: 150)
 * @returns Delay value in milliseconds
 */
export function getStaggeredDelay(
    index: number,
    baseDelay: number = 0,
    staggerDelay: number = 150
): number {
    return baseDelay + index * staggerDelay;
}

/**
 * Convenience function combining animation classes and delay
 * @param isVisible - Whether the element should be visible
 * @param index - Optional index for staggered animations
 * @param options - Animation options
 * @returns Object with className and style for React components
 */
export function blurAnimation(
    isVisible: boolean,
    index?: number,
    options: BlurAnimationOptions & { staggerDelay?: number; baseDelay?: number } = {}
) {
    const {
        variant = "default",
        className = "",
        staggerDelay = 150,
        baseDelay = 0,
    } = options;

    const delay =
        index !== undefined
            ? getStaggeredDelay(index, baseDelay, staggerDelay)
            : options.delay;

    return {
        className: getBlurAnimationClasses(isVisible, { variant, className }),
        style: delay !== undefined ? getBlurAnimationDelay(delay) : undefined,
    };
}

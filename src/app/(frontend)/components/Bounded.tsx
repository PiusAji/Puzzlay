import { CSSProperties, ReactNode, ElementType, createElement } from 'react'
import clsx from 'clsx'

interface BoundedProps {
  as?: ElementType
  className?: string
  style?: CSSProperties
  children: ReactNode
  [key: string]: unknown
}

export function Bounded({ as = 'div', className, children, ...restProps }: BoundedProps) {
  return createElement(
    as,
    {
      className: clsx('px-2 py-4 md:py-8 [.header+&]:pt-44 [.header+&]:md:pt-32', className),
      ...restProps,
    },
    createElement('div', { className: 'mx-auto w-full max-w-6xl md:max-w-[90rem]' }, children),
  )
}

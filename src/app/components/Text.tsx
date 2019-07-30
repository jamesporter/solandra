import React from "react"

// tw escape hatch until better understand actual desired uses
type TextProps = {
  children: React.ReactNode
  tw?: string
}

export const H1 = ({ children, tw }: TextProps) => (
  <h1 className={`${tw || ""} text-4xl text-center`}>{children}</h1>
)

export const H2 = ({ children, tw }: TextProps) => (
  <h2 className={`${tw || ""} text-2xl text-center`}>{children}</h2>
)

export const H3 = ({ children, tw }: TextProps) => (
  <h2 className={`${tw || ""} text-xl text-center`}>{children}</h2>
)

export const P = ({ children, tw }: TextProps) => (
  <h2 className={`${tw || ""} text-md pb-4`}>{children}</h2>
)

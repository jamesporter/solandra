import React from "react"

// tw escape hatch until better understand actual desired uses
type TextProps = {
  children: React.ReactNode
}

export const H1 = ({ children }: TextProps) => (
  <h1 className={`text-4xl text-center`}>{children}</h1>
)

export const H2 = ({ children }: TextProps) => (
  <h2 className={`text-2xl text-center`}>{children}</h2>
)

export const H3 = ({ children }: TextProps) => (
  <h2 className={`text-xl text-center`}>{children}</h2>
)

export const P = ({ children }: TextProps) => (
  <h2 className={`text-md pb-2`}>{children}</h2>
)

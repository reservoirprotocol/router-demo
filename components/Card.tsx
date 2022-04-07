import React, { FC } from 'react'

const Card: FC = ({ children }) => (
  <article className="rounded-2xl border border-[#D1D5DB] p-6">
    {children}
  </article>
)

export default Card

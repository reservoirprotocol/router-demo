import React, { FC } from 'react'

const Card: FC = ({ children }) => (
  <article className="border-2 p-3 lg:p-5 border-primary-900 rounded-md">
    {children}
  </article>
)

export default Card

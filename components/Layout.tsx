import React, { FC } from 'react'
import NetworkWarning from './NetworkWarning'

const Layout: FC = ({ children }) => (
  <>
    <NetworkWarning />
    <main className="mx-auto px-6 max-w-screen-2xl mb-6">{children}</main>
  </>
)

export default Layout

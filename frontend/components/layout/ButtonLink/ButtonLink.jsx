import React, { forwardRef } from 'react'
import Link from 'next/link'

const ButtonLink = forwardRef(({ className, href, hrefAs, children }, ref) => (
    <Link href={ href } as={ hrefAs } ref={ ref }>
        <a className={ className }>
            { children }
        </a>
    </Link>
));

export default ButtonLink;
import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M6 5.5h10.2c5.2 0 8.3 2.7 8.3 7 0 3-1.6 5.2-4.4 6.3L26 26.5h-5.7l-5.1-6.9H11v6.9H6v-21Zm5 4.3v5.7h4.8c2.3 0 3.6-1 3.6-2.9 0-1.8-1.3-2.8-3.6-2.8H11Z" />
        </svg>
    );
}

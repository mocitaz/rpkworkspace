export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                RPK Law Firm Workspace
            </p>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-1 text-lg font-semibold tracking-[-0.02em]'
                        : 'text-2xl font-semibold tracking-[-0.03em]'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </header>
    );
}

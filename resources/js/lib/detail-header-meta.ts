type DetailHeaderMetadata = {
    testId: string;
    label: string;
    className: string;
};

export function getDetailHeaderMetadata(
    identifier?: string,
): DetailHeaderMetadata[] {
    if (!identifier) {
        return [];
    }

    return [
        {
            testId: 'detail-number-text',
            label: identifier,
            className: 'font-mono text-blue-600 dark:text-blue-400',
        },
    ];
}

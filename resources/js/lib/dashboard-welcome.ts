export function getDashboardDisplayName(fullName: string): string {
    const names = fullName.trim().split(/\s+/).filter(Boolean);

    return names.slice(0, 2).join(' ') || 'Rekan';
}

export function getDashboardGreeting(hour: number): string {
    if (hour < 11) {
        return 'Selamat pagi';
    }

    if (hour < 15) {
        return 'Selamat siang';
    }

    if (hour < 19) {
        return 'Selamat sore';
    }

    return 'Selamat malam';
}

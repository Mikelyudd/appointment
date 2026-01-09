// src/lib/date-utils.ts
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

export function formatTime(timeString: string): string {
    // 假设时间格式为 "HH:mm"
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

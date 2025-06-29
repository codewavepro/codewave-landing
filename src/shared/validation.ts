export type ContactMethod = 'email' | 'telegram' | 'twitter' | 'discord' | 'linkedin' | 'whatsapp';

export function validateContactDetails(method: ContactMethod, details: string): boolean {
    if (!details.trim()) return false;

    switch (method) {
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details);
        case 'telegram':
            return /^@[a-zA-Z0-9_]{5,}$/.test(details) || /^(https?:\/\/)?(t\.me\/)[a-zA-Z0-9_]{5,}$/.test(details);
        case 'twitter':
            return /^@[a-zA-Z0-9_]{1,15}$/.test(details) || /^(https?:\/\/)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/.test(details);
        case 'discord':
            return /^[a-zA-Z0-9_-]{2,32}$/.test(details) || /^(https?:\/\/)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9_-]+$/.test(details);
        case 'linkedin':
            return /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/.test(details);
        case 'whatsapp':
            return /^\+[0-9]{7,15}$/.test(details) || /^(https?:\/\/)?(wa\.me)\/[0-9]{7,15}$/.test(details);
        default:
            return true;
    }
}

export function validateDate(dateStr: string): boolean {
    if (!dateStr) return true;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(selectedDate.getTime()) && selectedDate >= today;
}
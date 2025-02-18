export const isValidDate = (dateStr: string): boolean => {
    return !isNaN(Date.parse(dateStr));
};

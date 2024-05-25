export const validateObjectNodes = (object: any, requiredFields: string[]): string[] => {
    const missingFields = requiredFields.filter(field => !object[field]);
    return missingFields;
};
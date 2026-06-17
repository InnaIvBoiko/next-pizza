// Replace `{name}` style placeholders in a dictionary string. Values are
// coerced to string; unknown placeholders are left untouched.
export const format = (
    template: string,
    vars: Record<string, string | number> = {}
): string =>
    template.replace(/\{(\w+)\}/g, (match, key) =>
        key in vars ? String(vars[key]) : match
    );

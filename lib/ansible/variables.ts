export function registerVariable(
  register: string,
  options: Record<string, unknown>,
) {
  return {
    name: `Register variable: ${register}`,
    register,
    ...options,
  };
}

export const useVariable = (variable: string) => `{{ ${variable}.stdout }}`;

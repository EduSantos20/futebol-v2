/**
 * Capitaliza a primeira letra e deixa o resto minúscula
 * @param {string} text - Texto a ser capitalizado
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text || typeof text !== "string") return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Hook customizado para inputs com capitalização automática
 * @param {object} initialForm - Estado inicial do formulário
 * @param {string[]} fieldsToCapitalize - Campos que devem ser capitalizados
 * @returns {object} Form state e funções de set
 */
export const useCapitalizeForm = (initialForm, fieldsToCapitalize = []) => {
  const [form, setForm] = require("react").useState(initialForm);

  const set = (k) => (e) => {
    const value = e.target.value;
    const shouldCapitalize = fieldsToCapitalize.includes(k);
    setForm((f) => ({
      ...f,
      [k]: shouldCapitalize ? capitalize(value) : value,
    }));
  };

  return { form, setForm, set };
};

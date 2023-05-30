export const normalizePhoneNumber = (phoneNumber: string) => {
  // Удаление всех символов, кроме цифр
  const normalizedNumber = phoneNumber.replace(/\D/g, '');
  // Проверка наличия кода страны
  if (normalizedNumber.startsWith('8'))
    return `7${normalizedNumber.slice(1)}`;

	 if (normalizedNumber.startsWith('0'))
    return `374${normalizedNumber.slice(1)}`;

  return normalizedNumber;
}

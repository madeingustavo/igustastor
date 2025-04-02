
/**
 * Validates an IMEI number using the Luhn algorithm
 */
export const validateIMEI = (imei: string) => {
  // Regex for validating IMEI (15 digits)
  const imeiRegex = /^[0-9]{15}$/;
  
  if (!imeiRegex.test(imei)) {
    return {
      isValid: false,
      message: "IMEI deve conter exatamente 15 dígitos numéricos"
    };
  }

  // Luhn algorithm for checksum validation
  let sum = 0;
  let isEven = false;
  
  for (let i = imei.length - 1; i >= 0; i--) {
    let digit = parseInt(imei[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return {
    isValid: sum % 10 === 0,
    message: sum % 10 === 0 ? "IMEI válido" : "IMEI inválido"
  };
};

/**
 * Validates an iPhone serial number
 */
export const validateSerialNumber = (serial: string) => {
  // Regex for validating iPhone serial number
  // Format: 12 alphanumeric characters
  const serialRegex = /^[A-Za-z0-9]{12}$/;
  
  return {
    isValid: serialRegex.test(serial),
    message: serialRegex.test(serial) 
      ? "Número de série válido" 
      : "Número de série deve conter 12 caracteres alfanuméricos"
  };
};

/**
 * Validates battery health percentage
 */
export const validateBatteryHealth = (health: string) => {
  // Regex for validating battery health (0-100%)
  const batteryRegex = /^(100|[1-9]?[0-9])%?$/;
  
  // If no % sign, add it for display
  const formattedHealth = health.endsWith('%') ? health : `${health}%`;
  
  return {
    isValid: batteryRegex.test(health),
    formattedValue: formattedHealth,
    message: batteryRegex.test(health) 
      ? "Valor de saúde da bateria válido" 
      : "Valor deve estar entre 0% e 100%"
  };
};

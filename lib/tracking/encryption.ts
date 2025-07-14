// Encryption service for Meta's SHA-256 standards
export class EncryptionService {
  private static instance: EncryptionService;

  private constructor() {}

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Hash email according to Meta standards
   * - Trim whitespace
   * - Convert to lowercase
   * - SHA-256 hash
   */
  public async hashEmail(email: string): Promise<string> {
    if (!email) return '';
    
    // Normalize email: trim and lowercase
    const normalizedEmail = email.trim().toLowerCase();
    
    return this.sha256Hash(normalizedEmail);
  }

  /**
   * Hash phone number according to Meta standards
   * - Remove all non-digit characters
   * - Keep numbers only
   * - SHA-256 hash
   */
  public async hashPhone(phone: string): Promise<string> {
    if (!phone) return '';
    
    // Normalize phone: keep only digits
    const normalizedPhone = phone.replace(/\D/g, '');
    
    return this.sha256Hash(normalizedPhone);
  }

  /**
   * Hash first name according to Meta standards
   * - Trim whitespace
   * - Convert to lowercase
   * - Remove special characters
   * - SHA-256 hash
   */
  public async hashFirstName(firstName: string): Promise<string> {
    if (!firstName) return '';
    
    // Normalize first name: trim, lowercase, remove special characters
    const normalizedName = firstName.trim().toLowerCase().replace(/[^a-z]/g, '');
    
    return this.sha256Hash(normalizedName);
  }

  /**
   * Hash last name according to Meta standards
   * - Trim whitespace
   * - Convert to lowercase
   * - Remove special characters
   * - SHA-256 hash
   */
  public async hashLastName(lastName: string): Promise<string> {
    if (!lastName) return '';
    
    // Normalize last name: trim, lowercase, remove special characters
    const normalizedName = lastName.trim().toLowerCase().replace(/[^a-z]/g, '');
    
    return this.sha256Hash(normalizedName);
  }

  /**
   * Hash gender according to Meta standards
   * - Convert to lowercase
   * - Accept only 'm' or 'f'
   * - SHA-256 hash
   */
  public async hashGender(gender: string): Promise<string> {
    if (!gender) return '';
    
    // Normalize gender: lowercase, only m or f
    const normalizedGender = gender.trim().toLowerCase();
    if (normalizedGender !== 'm' && normalizedGender !== 'f') {
      return ''; // Invalid gender
    }
    
    return this.sha256Hash(normalizedGender);
  }

  /**
   * Hash date of birth according to Meta standards
   * - Format as YYYYMMDD
   * - SHA-256 hash
   */
  public async hashDateOfBirth(dateOfBirth: string | Date): Promise<string> {
    if (!dateOfBirth) return '';
    
    let normalizedDate: string;
    
    if (dateOfBirth instanceof Date) {
      // Format Date object as YYYYMMDD
      const year = dateOfBirth.getFullYear();
      const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
      const day = String(dateOfBirth.getDate()).padStart(2, '0');
      normalizedDate = `${year}${month}${day}`;
    } else {
      // Assume string is already in YYYYMMDD format or normalize it
      normalizedDate = dateOfBirth.replace(/[-\/]/g, '');
      
      // Validate format (should be 8 digits)
      if (!/^\d{8}$/.test(normalizedDate)) {
        return ''; // Invalid date format
      }
    }
    
    return this.sha256Hash(normalizedDate);
  }

  /**
   * Hash city according to Meta standards
   * - Trim whitespace
   * - Convert to lowercase
   * - Remove special characters except spaces
   * - SHA-256 hash
   */
  public async hashCity(city: string): Promise<string> {
    if (!city) return '';
    
    // Normalize city: trim, lowercase, remove special characters except spaces
    const normalizedCity = city.trim().toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ');
    
    return this.sha256Hash(normalizedCity);
  }

  /**
   * Hash state according to Meta standards
   * - Trim whitespace
   * - Convert to lowercase
   * - Use 2-letter state codes when possible
   * - SHA-256 hash
   */
  public async hashState(state: string): Promise<string> {
    if (!state) return '';
    
    // Normalize state: trim, lowercase
    const normalizedState = state.trim().toLowerCase();
    
    return this.sha256Hash(normalizedState);
  }

  /**
   * Hash zip code according to Meta standards
   * - Keep only alphanumeric characters
   * - Convert to lowercase
   * - SHA-256 hash
   */
  public async hashZipCode(zipCode: string): Promise<string> {
    if (!zipCode) return '';
    
    // Normalize zip code: keep only alphanumeric, lowercase
    const normalizedZip = zipCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return this.sha256Hash(normalizedZip);
  }

  /**
   * Hash country according to Meta standards
   * - Use 2-letter ISO country codes
   * - Convert to lowercase
   * - SHA-256 hash
   */
  public async hashCountry(country: string): Promise<string> {
    if (!country) return '';
    
    // Normalize country: trim, lowercase
    let normalizedCountry = country.trim().toLowerCase();
    
    // Convert common country names to ISO codes
    const countryMapping: { [key: string]: string } = {
      'united states': 'us',
      'usa': 'us',
      'united kingdom': 'gb',
      'uk': 'gb',
      'saudi arabia': 'sa',
      'ksa': 'sa',
      'uae': 'ae',
      'united arab emirates': 'ae',
    };
    
    normalizedCountry = countryMapping[normalizedCountry] || normalizedCountry;
    
    return this.sha256Hash(normalizedCountry);
  }

  /**
   * Hash external ID according to Meta standards
   * - Keep as is but trim whitespace
   * - SHA-256 hash (recommended by Meta)
   */
  public async hashExternalId(externalId: string): Promise<string> {
    if (!externalId) return '';
    
    const normalizedId = externalId.trim();
    
    return this.sha256Hash(normalizedId);
  }

  /**
   * Core SHA-256 hashing function
   */
  private async sha256Hash(data: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Browser environment - use Web Crypto API
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Node.js environment - use crypto module
      const crypto = await import('crypto');
      return crypto.createHash('sha256').update(data).digest('hex');
    }
  }

  /**
   * Batch hash multiple user data fields
   */
  public async hashUserData(userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    dateOfBirth?: string | Date;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    externalId?: string;
  }): Promise<{
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
    ge?: string;
    db?: string;
    ct?: string;
    st?: string;
    zp?: string;
    country?: string;
    external_id?: string;
  }> {
    const hashedData: any = {};

    if (userData.email) {
      hashedData.em = await this.hashEmail(userData.email);
    }

    if (userData.phone) {
      hashedData.ph = await this.hashPhone(userData.phone);
    }

    if (userData.firstName) {
      hashedData.fn = await this.hashFirstName(userData.firstName);
    }

    if (userData.lastName) {
      hashedData.ln = await this.hashLastName(userData.lastName);
    }

    if (userData.gender) {
      hashedData.ge = await this.hashGender(userData.gender);
    }

    if (userData.dateOfBirth) {
      hashedData.db = await this.hashDateOfBirth(userData.dateOfBirth);
    }

    if (userData.city) {
      hashedData.ct = await this.hashCity(userData.city);
    }

    if (userData.state) {
      hashedData.st = await this.hashState(userData.state);
    }

    if (userData.zipCode) {
      hashedData.zp = await this.hashZipCode(userData.zipCode);
    }

    if (userData.country) {
      hashedData.country = await this.hashCountry(userData.country);
    }

    if (userData.externalId) {
      hashedData.external_id = await this.hashExternalId(userData.externalId);
    }

    return hashedData;
  }

  /**
   * Validate email format before hashing
   */
  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate phone format before hashing
   */
  public isValidPhone(phone: string): boolean {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }

  /**
   * Test hash function with known values for debugging
   */
  public async testHashing(): Promise<void> {
    console.log('Testing Meta encryption standards:');
    
    // Test email hashing
    const testEmail = 'example@fb.com';
    const hashedEmail = await this.hashEmail(testEmail);
    console.log(`Email: ${testEmail} -> ${hashedEmail}`);
    // Expected: 7a1d9f839aa2d4f3f348e8303bfcf699fd7c243baeb55238ee2d1bcd7b80f30e
    
    // Test phone hashing
    const testPhone = '1-612-591-9838';
    const hashedPhone = await this.hashPhone(testPhone);
    console.log(`Phone: ${testPhone} -> ${hashedPhone}`);
    // Expected: dc7c6a9e4f0a28c9be8461414daab780eb50d7567f1548614c5e143c32bfbd8b
    
    // Test name hashing
    const testFirstName = 'John';
    const hashedFirstName = await this.hashFirstName(testFirstName);
    console.log(`First Name: ${testFirstName} -> ${hashedFirstName}`);
    
    const testLastName = 'Doe';
    const hashedLastName = await this.hashLastName(testLastName);
    console.log(`Last Name: ${testLastName} -> ${hashedLastName}`);
  }
} 


const API_BASE_URL = 'https://gana-back-plum.vercel.app';


export const azkarApi = {
  
  getSections: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/azkar/sections`);
      if (!response.ok) {
        throw new Error('Failed to fetch azkar sections');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching azkar sections:', error);
      throw error;
    }
  },

 
  getSectionAzkar: async (sectionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/azkar/${sectionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch azkar for section: ${sectionId}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching azkar for section ${sectionId}:`, error);
      throw error;
    }
  },

  
  getAllAzkarData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/azkar`);
      if (!response.ok) {
        throw new Error('Failed to fetch all azkar data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all azkar data:', error);
      throw error;
    }
  }
};
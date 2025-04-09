// Mock client functions that simulate backend operations
// This replaces real Firebase client operations with mock versions

// Mock function to simulate image upload
export async function uploadImage(file: File, path: string = 'images'): Promise<string> {
  return new Promise((resolve) => {
    // Create a placeholder image URL
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 15);
      resolve(`https://via.placeholder.com/300?text=Mock+Image+${randomId}`);
    }, 1000); // Simulate network delay
  });
}

// Mock function to simulate data fetching
export async function fetchData(collection: string, id?: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get data from localStorage or return mock data
      if (id) {
        const key = `mock_${collection}_${id}`;
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      } else {
        // Return mock collection data
        const mockData = {
          users: [
            { id: '1', name: 'John Doe', email: 'john@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
          ],
          listings: [
            { 
              id: '1', 
              title: 'Sample Listing 1', 
              description: 'This is a sample listing',
              price: 100,
              seller: '1'
            },
            { 
              id: '2', 
              title: 'Sample Listing 2', 
              description: 'Another sample listing',
              price: 200,
              seller: '2'
            }
          ],
          bids: [
            { id: '1', amount: 110, bidder: '2', listing: '1' },
            { id: '2', amount: 210, bidder: '1', listing: '2' }
          ]
        };
        
        resolve(mockData[collection as keyof typeof mockData] || []);
      }
    }, 500);
  });
}

// Mock function to simulate data saving
export async function saveData(collection: string, data: any, id?: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const docId = id || Math.random().toString(36).substring(2, 15);
      const key = `mock_${collection}_${docId}`;
      localStorage.setItem(key, JSON.stringify(data));
      resolve(docId);
    }, 500);
  });
}

// Mock function to simulate data updating
export async function updateData(collection: string, id: string, data: any): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `mock_${collection}_${id}`;
      const existingData = localStorage.getItem(key);
      if (existingData) {
        const updatedData = { ...JSON.parse(existingData), ...data };
        localStorage.setItem(key, JSON.stringify(updatedData));
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
}

// Mock function to simulate data deletion
export async function deleteData(collection: string, id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `mock_${collection}_${id}`;
      localStorage.removeItem(key);
      resolve(true);
    }, 500);
  });
}

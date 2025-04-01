// src/utilities/supabase.ts
// Dummy export for pipeline to run
// To be replaced with other DB-structure
// Made by GPT

const supabase = {
    storage: {
      from: (bucketName: string) => ({
        upload: async (id: string, file: any, options: any) => {
          console.log(`Mock upload to bucket ${bucketName} with id ${id}`);
          return { data: null, error: null };
        },
        list: async () => {
          console.log("Mock list from bucket");
          return { data: [], error: null };
        },
      }),
    },
  };
  
  export default supabase;
  
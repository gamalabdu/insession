"use client"
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

// Define the props for the component, if needed
interface SelectGenresProps {
    selectedGenres : string []
    setSelectedGenres: Function
}

const SelectGenres = (props: SelectGenresProps) => {

    const { selectedGenres, setSelectedGenres } = props 
  
    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any | null>(null);

    const supabase = createClient()


    useEffect(() => {

        const fetchGenres = async () => {

            setLoading(true);
            try {
                const { data, error } = await supabase.from('genres').select('*');
                if (error) throw error;
                if (data) {
                    // Assuming your genres are in the format { name: string }[]
                    const genreNames = data.map((genre) => genre.name);
                    setGenres(genreNames);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();

    }, []); 

  // Function to handle selecting and deselecting genres
  const toggleGenreSelection = (genre: string) => { 
    if (selectedGenres.includes(genre)) {
      // Remove genre from selection
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      // Add genre to selection
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className="flex flex-col w-full">

      <div className='flex gap-2'>
          <label htmlFor="genres" className="mb-2 text-sm"> Select Genres : </label>
            {selectedGenres.length > 0 ? (
              <p className='text-sm'>{selectedGenres.join(' / ')}</p>
            ) : (
              <p className='text-sm text-neutral-500'>No genres selected.</p>
            )}

      </div>


      <div className="border border-gray-300 rounded-md h-[80px] overflow-auto">

        {
        
        loading ? 

        <div> Loading... </div>


        :
        
        genres.map((genre) => (
          <div key={genre} className="flex items-center p-2">
            <input
              type="checkbox"
              id={`genre-${genre}`}
              checked={selectedGenres.includes(genre)}
              onChange={() => toggleGenreSelection(genre)}
              className="mr-2"
            />
            <label htmlFor={`genre-${genre}`} className="flex-1 cursor-pointer">{genre}</label>
          </div>
          ))
        
        }



      </div>
      {/* Optionally, you can display the selected genres below */}
      
      {/* <div className="mt-4">
        <strong>Selected Genres:</strong>
        {selectedGenres.length > 0 ? (
          <p>{selectedGenres.join(' / ')}</p>
        ) : (
          <p>No genres selected.</p>
        )}
      </div> */}

    </div>
  );
};

export default SelectGenres;

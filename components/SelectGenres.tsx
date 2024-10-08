
// import { createClient } from '@/utils/supabase/client';
// import { useEffect, useState } from 'react';
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
// import { Genre } from '@/types';

// interface SelectGenresProps {
//     selectedGenres: Genre[];
//     setSelectedGenres: (genres: Genre[]) => void;
// }

// const SelectGenres = (props: SelectGenresProps) => {

//     const { selectedGenres, setSelectedGenres } = props;

//     const [genres, setGenres] = useState<string[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<any | null>(null);
//     const [isOpen, setIsOpen ] = useState(false)

//     const supabase = createClient();

//     useEffect(() => {
//         const fetchGenres = async () => {
//             setLoading(true);
//             try {
//                 const { data, error } = await supabase.from('genres').select('*');
//                 if (error) throw error;
//                 if (data) {
//                     const genreNames = data.map((genre) => genre.name);
//                     setGenres(genreNames);
//                 }
//             } catch (error) {
//                 setError(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGenres();
//     }, []);

//     const toggleGenreSelection = (genre: string) => {
//         if (selectedGenres.includes(genre)) {
//             setSelectedGenres(selectedGenres.filter((g) => g !== genre));
//         } else {
//             setSelectedGenres([...selectedGenres, genre]);
//         }
//     };

//     return (
//         <div className="flex flex-col w-full">
//             <DropdownMenu.Root onOpenChange={ (open) => setIsOpen(open) }>
//                 <DropdownMenu.Trigger className="bg-neutral-800 rounded-md p-2 cursor-pointer focus:outline-none flex align-middle justify-between items-center">
//                 <div>{selectedGenres.length > 0 ? selectedGenres.join(', ') : "Select genre(s)"}</div>
//                 <IoIosArrowDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
//                 </DropdownMenu.Trigger>
//                 <DropdownMenu.Content 
//                     className="rounded-md shadow-lg bg-neutral-800 p-1 max-h-60 w-[400px] overflow-auto border"
//                     id="dropdown-content"
//                 >
//                     {loading ? (
//                         <div>Loading...</div>
//                     ) : (
//                         genres.map((genre) => (
//                             <DropdownMenu.Item key={genre} asChild onSelect={event => event.preventDefault()}>
//                                 <div className="flex items-center p-2">
//                                     <input
//                                         type="checkbox"
//                                         id={`genre-${genre}`}
//                                         checked={selectedGenres.includes(genre)}
//                                         onChange={() => toggleGenreSelection(genre)}
//                                         className=" appearance-none mr-2 w-4 h-4 border-2 rounded-sm bg-transparent checked:bg-neutral-500 "
//                                     />
//                                     <label htmlFor={`genre-${genre}`} className="flex-1 cursor-pointer">{genre}</label>
//                                 </div>
//                             </DropdownMenu.Item>
//                         ))
//                     )}
//                     {error && <p className="text-red-500 text-xs mt-2">Error loading genres</p>}
//                 </DropdownMenu.Content>
//             </DropdownMenu.Root>
//         </div>
//     );
// };

// export default SelectGenres;















import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Genre } from '@/types';
import { useUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';

interface SelectGenresProps {
    selectedGenres: Genre[];
    setSelectedGenres: (genres: Genre[]) => void;
    user_id?: string
    isSongOrBid?: boolean
}

type GenreItem = {
    genre_id: string,
    user_id: string,
    name: string
}

type SongItem = {
    song_id: string,
    genre_id: string,
    name: string
}

const SelectGenres = (props: SelectGenresProps) => {


    const { selectedGenres, setSelectedGenres, user_id, isSongOrBid } = props;

    const [genres, setGenres] = useState<Genre[]>([]);
    const [userGenres, setUserGenres ] = useState<GenreItem[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const supabase = createClient();




useEffect(() => {

    async function fetchGenresData() {

        setLoading(true);

        try {


            const { data: allGenres, error: genreError } = await supabase
                .from('genres')
                .select('id, name');
            
                    if ( genreError ) {
                        toast.error(genreError.message)
                    }

                    if ( allGenres)   { setGenres(allGenres) }



            if ( !isSongOrBid ) {
            
            const { data: userGenresData, error: userGenresError } = await supabase
                .from('profiles_genres')
                .select('genre_id, user_id, name')
                .eq('user_id', user_id)
                .returns<GenreItem[]>()

            if (genreError || userGenresError) throw { genreError, userGenresError };

            if (userGenresData) {
                // Filter to only include genres that the user currently has
                const activeGenres = allGenres.filter(g => userGenresData.some(ug => ug.name === g.name));
                setSelectedGenres(activeGenres);  // Set initially selected genres from user's current genres
                setUserGenres(userGenresData);

                // the genres appear but I cannot select new genres 
            }

            }



        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    fetchGenresData();

}, [user_id, setSelectedGenres])



    const toggleGenreSelection = (genre: Genre) => {
        // console.log("Toggling genre:", genre);
        const isAlreadySelected = selectedGenres.some(selected => selected.name === genre.name);
        const newSelectedGenres = isAlreadySelected
            ? selectedGenres.filter((g) => g.name !== genre.name)
            : [...selectedGenres, genre];
        setSelectedGenres(newSelectedGenres);
        // console.log("New selected genres:", newSelectedGenres);
    };
    


    

    return (
        <div className="flex flex-col w-full">
            <DropdownMenu.Root onOpenChange={setIsOpen}>
                <DropdownMenu.Trigger className="bg-neutral-800 text-neutral-400 text-sm rounded-md p-2 cursor-pointer focus:outline-none flex align-middle justify-between items-center">
                    <div>
                        {   selectedGenres.length > 0 ? 

                               isSongOrBid ? 

                               selectedGenres.map(g => g.name).join(', ')

                               :
                        
                            //    userGenres.map(g => g.name).join(', ') : 

                               selectedGenres.map(g => g.name).join(', ') : 

                               "Select genre(s)"
                        
                        }
                    
                    </div>
                    <IoIosArrowDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content 
                    className="rounded-md text-sm text-neutral-400 bg-neutral-800 p-1 max-h-60 w-[400px] overflow-auto border"
                    id="dropdown-content"
                >
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        genres.map((genre) => (
                            <DropdownMenu.Item key={genre.id} asChild onSelect={event => event.preventDefault()} >
                                <div className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        id={`genre-${genre.id}`}
                                        checked={selectedGenres.some(g => g.name === genre.name)}
                                        onChange={() => toggleGenreSelection(genre)}
                                        className=" border-neutral-400 appearance-none mr-2 w-4 h-4 border-2 rounded-sm bg-transparent checked:bg-neutral-500"
                                    />
                                    <label htmlFor={`genre-${genre.name}`} className="flex-1 cursor-pointer">{genre.name}</label>
                                </div>
                            </DropdownMenu.Item>
                        ))
                    )}
                    {error && <p className="text-red-500 text-xs mt-2">Error loading genres</p>}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
};

export default SelectGenres;
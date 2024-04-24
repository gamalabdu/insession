
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface SelectGenresProps {
    selectedGenres: string[];
    setSelectedGenres: (genres: string[]) => void;
}

const SelectGenres = (props: SelectGenresProps) => {
    const { selectedGenres, setSelectedGenres } = props;

    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any | null>(null);
    const [isOpen, setIsOpen ] = useState(false)

    const supabase = createClient();

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('genres').select('*');
                if (error) throw error;
                if (data) {
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

    const toggleGenreSelection = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <DropdownMenu.Root onOpenChange={ (open) => setIsOpen(open) }>
                <DropdownMenu.Trigger className="bg-neutral-800 rounded-md p-2 cursor-pointer focus:outline-none flex align-middle justify-between items-center">
                <div>{selectedGenres.length > 0 ? selectedGenres.join(', ') : "Select genre(s)"}</div>
                <IoIosArrowDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content 
                    className="rounded-md shadow-lg bg-neutral-800 p-1 max-h-60 w-[400px] overflow-auto border"
                    id="dropdown-content"
                >
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        genres.map((genre) => (
                            <DropdownMenu.Item key={genre} asChild onSelect={event => event.preventDefault()}>
                                <div className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        id={`genre-${genre}`}
                                        checked={selectedGenres.includes(genre)}
                                        onChange={() => toggleGenreSelection(genre)}
                                        className=" appearance-none mr-2 w-4 h-4 border-2 rounded-sm bg-transparent checked:bg-neutral-500 "
                                    />
                                    <label htmlFor={`genre-${genre}`} className="flex-1 cursor-pointer">{genre}</label>
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

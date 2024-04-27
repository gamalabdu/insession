"use client"
import useDebounce from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import qs  from 'query-string'
import Input from './Input'

interface SearchInputProps {
  baseRoute?: string;
  placeholder: string;
}

const SearchInput = (props: SearchInputProps ) => {

  const { baseRoute = '/search' , placeholder} = props

    const router = useRouter()

    const [ value , setValue ] = useState<string>("")

    const debouncedValue = useDebounce<string>(value, 500)

    useEffect(() => {

        const query = {
            search: debouncedValue
        }

        // const url = qs.stringifyUrl({
        //     url: '/search',
        //     query: query
        // })

        const url = qs.stringifyUrl({ url: baseRoute, query });

        router.push(url)
        
    }, [debouncedValue, router ])


  return (
    <Input 
    placeholder={placeholder}
    value={value}
    onChange={ (e) => setValue(e.target.value) }
    />
  )

}

export default SearchInput
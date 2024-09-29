import { useEffect, useState } from 'react'
import './index.css'
import { PokemonCards } from './PokemonCards'

export const Pokemon = () => {

    const [pokemon, setPokemon] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")

    const API = "https://pokeapi.co/api/v2/pokemon?limit=150"

    const fetchPokemon = async() => {
        try {
            const res = await fetch(API)
            const data = await res.json()
            // console.log(data);

            const detailedPokemonData = data.results.map(async(currPokemon)=>{
                // call all individual url's
                const res = await fetch(currPokemon.url)
                const data = await res.json()
                return data
                
            })

            const detailedResponses = await Promise.all(detailedPokemonData)
            setPokemon(detailedResponses)
            setLoading(false)
            
            

        } catch (error) {
            console.log(error);
            setLoading(false)
            setError(error)
            
        }
    }


    useEffect(()=>{
        fetchPokemon()
    }, [])

    // search function
    const searchData = pokemon.filter((currPokemon)=>
        currPokemon.name.toLowerCase().includes(search.toLowerCase())
    )

    if(loading){
        return(
            <div>
                <h1>Loading.....</h1>
            </div>
        )
    }

    if(error){
        return(
            <div>
                <h1>{error.message}</h1>
            </div>
        )
    }



    return (
        <section className='container'>
            <header>
                <h1>Gotta Catch "Em All!</h1>
            </header>

            <div className='pokemon-search'>
                <input type="text"placeholder='Search Pokémon' value={search} onChange={()=>setSearch(event.target.value)}/>
            </div>

            <div>
                <ul className='cards'>
                    {
                        // pokemon.map((currPokemon)=>{
                            searchData.map((currPokemon)=>{
                            return (
                                <PokemonCards key={currPokemon.id} pokemonData={currPokemon}/>
                            )
                        })
                    }
                </ul>
            </div>
        </section>
    )
}
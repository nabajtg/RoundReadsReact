import React from 'react'
import './ItemComponent.css'
import ItemCard from './ItemCard'
import { DataContext } from './Context/Contexts'


function ItemComponent() {
    const {next, prev, getItems, count, items} = React.useContext(DataContext)
    
    return (
            <div id="itemsBlock">
                <p>Showing {items.length} of {count} Results</p>
                <ItemCard/>     
                <div>
                    {prev?(
                        <>
                            <button className='prev-next-button' onClick={() => {getItems(prev)}}>Prev</button>
                        </> 
                    ):(null)}
                    {next?(
                        <>
                            <button className='prev-next-button' onClick={() => {getItems(next)}}>Next</button>
                        </> 
                    ):(null)}
                
                </div>       
            </div>
            
    )
}
export default ItemComponent

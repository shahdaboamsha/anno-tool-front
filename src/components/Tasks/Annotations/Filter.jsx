import { useEffect, useMemo, useState } from "react"
import InputSelect from "../../Inputs/InputSelect"
import InputText from "../../Inputs/InputText"
import { Button } from "@mui/material"

const  formatDateToLong = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return new Intl.DateTimeFormat('en-GB', options).format(date)
}

export default function Filter({ filterData, data = [], setSearchResult }) {

    
    const { keys, displayKeys } = filterData

    const [searchKey, setSearchKey] = useState(filterData.keys[0])

    const [displaySearchKey, setDisplaySearchKey] = useState(filterData.displayKeys[0])
    const [searchValue, setSearchValue] = useState("")

    const handleChange = (event) => {

        const { name, value } = event.target

        if (name === 'searchKey') {

            const keyIndex = displayKeys.indexOf(value)

            setSearchKey(keys[keyIndex])
            setDisplaySearchKey(value)
        }
        else if (name === 'searchValue') {

            if (value.trim() === ""){
                setSearchResult(data)
            }
            setSearchValue(value)
        }
    }

    const search = () => {

        const searchResult = data.filter(anno => {

            if (searchKey == 'annotated_by') {
                if (anno['annotated_by']['name'].startsWith(searchValue.toString())) {
                    return anno
                }
            }
            else if ((searchKey == 'created_at')){
                
                const formattedData = formatDateToLong(anno['created_at'])
                if (formattedData.startsWith(searchValue)){
                    return anno
                }
            }
            else if (anno[searchKey].startsWith(searchValue)) {
                return anno
            }
            return null
        })
        setSearchResult(searchResult)
    }

    return (
        <div id="filter" className="flex gap-1 mb-0">

            <InputSelect name="searchKey" title="Filter key" withDetection={false}
                value={displaySearchKey}
                validation_error={null}
                menuItems={filterData.displayKeys}
                changeHandler={handleChange}
            />

            <InputText type='text' name="searchValue" title="Filter value" widthDetection={false}
                placeholder='Value'
                value={searchValue}
                validation_error={null}
                changeHandler={handleChange}
            />

            <Button onClick={search}>Search</Button>
        </div>
    )
}
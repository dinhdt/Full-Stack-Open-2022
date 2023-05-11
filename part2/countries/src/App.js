import { useState, useEffect } from 'react'
import CountryFilter from './components/CountryFilter'
import axios from 'axios'


const CountryView = (props) => {
  return(
    <div>
      <h3>{props.country.name.common}</h3>
      <div>capital {props.country.capital[0]}</div>
      <div>area {props.country.area}</div>

      <h4>Languages</h4>
      <div>
        <ul>
          {Object.entries(props.country.languages).map(lang => <li key={lang}>{lang[1]}</li>)}
        </ul>
      </div>
      <div>
        <img style={{width:'15%'}} src={props.country.flags.svg} alt={props.country.flags} />
      </div>
    </div>
  )
}

const Countries = (props) => {
    if(props.countries.length > 10) {
      return(
        <div>Too many matches, specify another filter</div>
      )
    }
    else {
      return(
          <div>
              {props.countries.map(country => <div key={country.name.common}>{country.name.common} <button onClick={() => props.buttonHandler(country)}>Show</button></div>)}
          </div>
      )
    }
  }


const App = () => {
  const baseUrl = "https://restcountries.com/v3.1/all"

  const [countries, setCountries] = useState([])
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountries, setShowCountries] = useState([])

  const countrySearchHandler = (event) => {
    setCountrySearch(event.target.value)
    setShowCountries([])
  }

  const clickShowCountry = (country) => {
    setShowCountries([country])
  }

  useEffect(() => {
    const request = axios.get(baseUrl)
    request
    .then(countries => {
      setCountries(countries.data)
      })
  }, [])

  const filteredCountries = countries.filter(country => country.name.common.toLocaleLowerCase().includes(countrySearch.toLocaleLowerCase()))
  if (filteredCountries.length === 1) {
    return (
      <div>
        <h2>Countries</h2>
        <CountryFilter filter_str={countrySearch} handler={countrySearchHandler}></CountryFilter>
        <CountryView country={filteredCountries[0]}/>
      </div>
    )
  }
  else {
    return (
      <div>
        <h2>Countries</h2>
        <CountryFilter filter_str={countrySearch} handler={countrySearchHandler}></CountryFilter>
        <Countries countries={filteredCountries} buttonHandler={clickShowCountry}></Countries> 
        {showCountries.map(cnt => <CountryView country={cnt} />)}           
      </div>
    )
  }
  
}


export default App;

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
      <h3>Weather in {props.country.capital[0]}</h3>
      <div> {`temperature ${props.temperature} °C`} </div>
      <div> 
          <img style={{width:'15%'}} src={props.url} alt={"current weather"} />
       </div>
      <div> {`wind ${props.wind} m/s`} </div>
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
  const [showCountries, setShowCountries] = useState(null)
  const [weatherData, setWeatherData] = useState({})

  const countrySearchHandler = (event) => {
    setCountrySearch(event.target.value)
    setShowCountries(null)
  }

  const clickShowCountry = (country) => {
    setShowCountries(country)
  }

  useEffect(() => {
    const request = axios.get(baseUrl)
    request
    .then(countries => {
      setCountries(countries.data)
      })
  }, [])

  useEffect(() => {
    if (showCountries) {
      const geoCodingURL = `http://api.openweathermap.org/geo/1.0/direct?q=${showCountries.capital}&appid=${process.env.REACT_APP_API_KEY}`
      const request = axios.get(geoCodingURL)
      request
      .then(geocode => {
        let weatherDataURL = `https://api.openweathermap.org/data/2.5/weather?lat=${geocode.data[0]["lat"]}&lon=${geocode.data[0]["lon"]}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
        axios.get(weatherDataURL)
        .then(
          weather => {  
          setWeatherData({img_url : `https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`, temperature : weather.data.main.temp, wind : weather.data.wind.speed})
         })
        })
        .catch(err => console.log(err))
    }

  }, showCountries)

  const filteredCountries = countries.filter(country => country.name.common.toLocaleLowerCase().includes(countrySearch.toLocaleLowerCase()))
  

  if(filteredCountries.length === 1 && (!showCountries || showCountries.name.common !==filteredCountries[0].name.common) ) {
    setShowCountries(filteredCountries[0])
  }

    if (showCountries) {
      return (
        <div>
          <h2>Countries</h2>
          <CountryFilter filter_str={countrySearch} handler={countrySearchHandler}></CountryFilter>
          <CountryView key={showCountries.name.common} country={showCountries} url={weatherData.img_url} temperature={weatherData.temperature} wind={weatherData.wind} />           
        </div>
      )
    
    }
    else {
      return (
        <div>
          <h2>Countries</h2>
          <CountryFilter filter_str={countrySearch} handler={countrySearchHandler}></CountryFilter>
          <Countries countries={filteredCountries} buttonHandler={clickShowCountry}></Countries> 
        </div>
      )
    }
  



  
}


export default App;

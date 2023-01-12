import { useState } from 'react'

const Button = ({onClickHandler, text}) =>  <button onClick={onClickHandler}>{text}</button>
const Header = (props) => <div><h1>{props.text}</h1></div>
const StatisticLine = (props) => <div><table><tbody><tr><td style={{width:"50px"}}>{props.text}</td><td>{props.value}</td></tr></tbody></table></div>

const Statistics = ({goodCount, neutralCount, badCount, allClicksCount}) => {
  if (allClicksCount > 0) {
    return(
      <div>
        <Header text="statistics" />
        <StatisticLine text="good" value={goodCount} /> 
        <StatisticLine text="neutral" value={neutralCount} />
        <StatisticLine text="bad" value={badCount} />
        <StatisticLine text="all" value={allClicksCount} />
        <StatisticLine text="average" value={(goodCount-badCount)/allClicksCount} />
        <StatisticLine text="positive" value={`${100*goodCount/allClicksCount} %`} />
      </div>
    )
  }
  else {
    return (
      <div>
        <Header text="statistics" />
        No feedback given
      </div>
    )
  }

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setallClicks] = useState(0)

  const clickHandlerGood = () => {
    setallClicks(allClicks+1)
    setGood(good+1)
  }
  const clickHandleNeutral= () => {
    setallClicks(allClicks+1)
    setNeutral(neutral+1)
  }
  const clickHandlerBad= () => {
    setallClicks(allClicks+1)
    setBad(bad+1)
  }
  // const goodCount = good
  // const neutralCount = neutral
  // const badCount = bad
  // const allClicksCount = allClicks

  // const props = {goodCount, neutralCount, allClicksCount, badCount}
  return (
    <div>
      <Header text="give feedback" />
      <Button text="good" onClickHandler={clickHandlerGood} />
      <Button text="neutral" onClickHandler={clickHandleNeutral} />
      <Button text="bad" onClickHandler={clickHandlerBad} />
      <Statistics goodCount={good} neutralCount={neutral} badCount={bad} allClicksCount={allClicks} />
      {/* <Statistics {...props} /> */}
    </div>
  )
}

export default App
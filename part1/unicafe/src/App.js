import { useState } from 'react'

const Button = ({onClickHandler, text}) =>  <button onClick={onClickHandler}>{text}</button>
const Header = (props) => <div><h1>{props.text}</h1></div>
const Content = (props) => <div>{props.text} {props.count}</div>



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

  
  return (
    <div>
      <Header text="give feedback" />
      <Button text="good" onClickHandler={clickHandlerGood} />
      <Button text="neutral" onClickHandler={clickHandleNeutral} />
      <Button text="bad" onClickHandler={clickHandlerBad} />
      <Header text="statistics" />
      <Content text="good" count={good} />
      <Content text="neutral" count={neutral} />
      <Content text="bad" count={bad} />
      <Content text="all" count={allClicks} />
      <Content text="average" count={(good-bad)/allClicks} />
      <Content text="positive" count={`${100*good/allClicks} %`} />
    </div>
  )
}

export default App